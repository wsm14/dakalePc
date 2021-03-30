import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import { Button, Tag } from 'antd';
import {
  SPECIAL_STATUS,
  GOODS_CLASS_TYPE,
  BUSINESS_TYPE,
  SPECIAL_RECOMMEND_TYPE,
} from '@/common/constant';
import AuthConsumer from '@/layouts/AuthConsumer';
import Ellipsis from '@/components/Ellipsis';
import PopImgShow from '@/components/PopImgShow';
import HandleSetTable from '@/components/HandleSetTable';
import TableDataBlock from '@/components/TableDataBlock';
import SpecialGoodsTrade from './components/SpecialGoods/SpecialGoodsTrade';
import SpecialRecommendMenu from './components/SpecialGoods/SpecialRecommendMenu';

const SpecialGoods = (props) => {
  const { specialGoods, loading, loadings, hubData, dispatch } = props;

  const childRef = useRef();
  const [visible, setVisible] = useState(false);
  const [goodsList, setGoodsList] = useState([]); // 选择推荐的商品

  // 获取商圈
  const fetchGetHubSelect = (districtCode) => {
    dispatch({
      type: 'baseData/fetchGetHubData',
      payload: {
        districtCode,
      },
    });
  };

  // 搜索参数
  const searchItems = [
    {
      label: '商品名称',
      name: 'goodsName',
    },
    {
      label: '商家名称',
      name: 'merchantName',
    },
    {
      label: '上架状态',
      name: 'status',
      type: 'select',
      select: SPECIAL_STATUS,
    },
    {
      label: '区域',
      name: 'city',
      type: 'cascader',
      valuesKey: ['provinceCode', 'cityCode', 'districtCode'],
      onChange: (val) => val.length && fetchGetHubSelect(val[2]),
    },
    {
      label: '商圈',
      name: 'businessHubId',
      type: 'select',
      loading: loadings.models.baseData,
      allItem: false,
      select: hubData,
      fieldNames: { label: 'businessHubName', value: 'businessHubIdString' },
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '商品名称/店铺',
      fixed: 'left',
      dataIndex: 'goodsImg',
      render: (val, row) => (
        <div style={{ display: 'flex' }}>
          <PopImgShow url={val} />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              flex: 1,
              marginLeft: 5,
            }}
          >
            <div style={{ display: 'flex' }}>
              <Tag color={row.goodsType === 'single' ? 'orange' : 'magenta'}>
                {GOODS_CLASS_TYPE[row.goodsType]}
              </Tag>
              <Ellipsis length={10} tooltip>
                {row.goodsName}
              </Ellipsis>
            </div>
            <div style={{ display: 'flex', marginTop: 5 }}>
              <Tag>{BUSINESS_TYPE[row.ownerType]}</Tag>
              <Ellipsis length={10} tooltip>
                {row.merchantName}
              </Ellipsis>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '原价/售价',
      align: 'right',
      dataIndex: 'oriPrice',
      render: (val, row) => (
        <div>
          <div style={{ textDecoration: 'line-through', color: '#999999' }}>
            ￥{Number(val).toFixed(2)}
          </div>
          <div>￥{Number(row.realPrice).toFixed(2)}</div>
        </div>
      ),
    },
    {
      title: '使用有效期',
      dataIndex: 'useStartTime',
      render: (val, row) => {
        const { useStartTime, useEndTime, useTimeRule, delayDays, activeDays } = row;
        if (useTimeRule === 'fixed') {
          return useStartTime + '~' + useEndTime;
        } else {
          if (delayDays === '0') {
            return `领取后立即生效\n有效期${activeDays}天`;
          }
          return `领取后${delayDays}天生效\n有效期${activeDays}天`;
        }
      },
    },
    {
      title: '活动时间',
      align: 'center',
      dataIndex: 'activeStartTime',
      render: (val, row) => (
        <>
          {row.activityTimeRule === 'infinite'
            ? `${row.createTime} ~ 长期`
            : `${val} ~ ${row.activeEndTime}`}
          <div>{SPECIAL_STATUS[row.status]}</div>
        </>
      ),
    },
    {
      title: '剩余数量',
      align: 'right',
      dataIndex: 'remain',
      sorter: (a, b) => a.remain - b.remain,
    },
    {
      title: '销量',
      align: 'right',
      dataIndex: 'soldGoodsCount',
      sorter: (a, b) => a.soldGoodsCount - b.soldGoodsCount,
    },
    {
      title: '核销数量',
      align: 'right',
      dataIndex: 'writeOffGoodsCount',
      sorter: (a, b) => a.writeOffGoodsCount - b.writeOffGoodsCount,
    },
    {
      title: '推广位置',
      dataIndex: 'recommendType',
      render: (val, row) => (row.recommendStatus !== '0' ? SPECIAL_RECOMMEND_TYPE[val] : '--'),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '操作',
      dataIndex: 'specialGoodsId',
      align: 'right',
      fixed: 'right',
      render: (val, record) => {
        const { goodsIdString: goodsIdStr, specialGoodsId } = record;
        return (
          <HandleSetTable
            formItems={[
              {
                type: 'down',
                visible: record.status != '0',
                click: () => fetchSpecialGoodsStatus({ ...record, goodsIdStr }),
              },
              {
                title: '置顶',
                auth: 'placement',
                pop: true,
                visible: record.status != '0',
                click: () => fetchSpecialGoodsRecommend({ specialGoodsId, operationFlag: 'top' }),
              },
              {
                pop: true,
                title: '取消置顶',
                auth: 'placement',
                visible: record.status != '0' && record.topStatus !== '0',
                click: () =>
                  fetchSpecialGoodsRecommend({ specialGoodsId, operationFlag: 'cancelTop' }),
              },
            ]}
          />
        );
      },
    },
  ];

  // 下架
  const fetchSpecialGoodsStatus = (payload) => {
    dispatch({
      type: 'specialGoods/fetchSpecialGoodsStatus',
      payload,
      callback: childRef.current.fetchGetData,
    });
  };

  // 推荐状态 / 置顶状态
  const fetchSpecialGoodsRecommend = (payload) => {
    dispatch({
      type: 'specialGoods/fetchSpecialGoodsRecommend',
      payload,
      callback: childRef.current.fetchGetData,
    });
  };

  // 行业类目
  const fetchTradeList = () => {
    dispatch({
      type: 'sysTradeList/fetchGetList',
    });
  };

  // 勾选的行业列表
  const fetchGetTradeSelect = () => {
    dispatch({
      type: 'baseData/fetchGetTradeSelect',
      callback: (detail) => setVisible({ show: true, detail: { categoryIds: detail } }),
    });
  };

  useEffect(() => {
    fetchTradeList();
  }, []);

  return (
    <>
      <TableDataBlock
        keepData
        cRef={childRef}
        btnExtra={
          <>
            <AuthConsumer auth="tradeSet">
              <Button className="dkl_green_btn" onClick={fetchGetTradeSelect}>
                行业设置
              </Button>
            </AuthConsumer>
            <SpecialRecommendMenu
              handleRecommend={(val) =>
                fetchSpecialGoodsRecommend({ specialGoodsId: goodsList.toString(), ...val })
              }
              disabled={!goodsList.length}
            ></SpecialRecommendMenu>
          </>
        }
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.specialGoodsId}`}
        rowSelection={{
          onChange: setGoodsList,
        }}
        dispatchType="specialGoods/fetchGetList"
        {...specialGoods}
      ></TableDataBlock>
      <SpecialGoodsTrade
        visible={visible}
        onCancel={() => setVisible({ show: false })}
      ></SpecialGoodsTrade>
    </>
  );
};

export default connect(({ specialGoods, baseData, loading }) => ({
  specialGoods,
  hubData: baseData.hubData,
  loading: loading.models.specialGoods,
  loadings: loading,
}))(SpecialGoods);
