import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { Tag, Button, Space } from 'antd';
import {
  BUSINESS_TYPE,
  SPECIAL_STATUS,
  GOODS_CLASS_TYPE,
  SPECIAL_RECOMMEND_TYPE,
} from '@/common/constant';
import AuthConsumer from '@/layouts/AuthConsumer';
import Ellipsis from '@/components/Ellipsis';
import ExcelButton from '@/components/ExcelButton';
import PopImgShow from '@/components/PopImgShow';
import TableDataBlock from '@/components/TableDataBlock';
import PreferentialDrawer from './components/PlatformRights/PreferentialDrawer';
import PlatformRightsDetail from './components/PlatformRights/PlatformRightsDetail';

const PlatformRights = (props) => {
  const { specialGoods, loading, dispatch } = props;
  const { list } = specialGoods;

  const childRef = useRef();
  const [visibleSet, setVisibleSet] = useState(false); // 新增特惠活动
  const [goodsList, setGoodsList] = useState([]); // 选择推荐的商品
  const [visibleInfo, setVisibleInfo] = useState(false); // 详情展示

  const { cancel, ...other } = SPECIAL_RECOMMEND_TYPE;
  const search_recommend = { notPromoted: '未推广', ...other };

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
      label: '集团/店铺名',
      name: 'groupOrMerchantName',
    },
    {
      label: '活动状态',
      name: 'status',
      type: 'select',
      select: SPECIAL_STATUS,
    },
    {
      label: '使用有效期',
      type: 'rangePicker',
      name: 'createStartTime',
      end: 'createEndTime',
    },
    {
      label: '推广位置',
      type: 'select',
      name: 'promotionLocation',
      select: search_recommend,
    },
    {
      label: '店铺区域',
      name: 'city',
      type: 'cascader',
      changeOnSelect: true,
      valuesKey: ['provinceCode', 'cityCode', 'districtCode'],
      onChange: (val) => val.length === 3 && fetchGetHubSelect(val[2]),
    },
    {
      label: '创建人',
      name: 'creator',
    },
    {
      label: '创建时间',
      type: 'rangePicker',
      name: 'createStartTime',
      end: 'createEndTime',
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
      title: '成本价',
      align: 'center',
      dataIndex: 'oriPrice',
    },
    {
      title: '使用有效期',
      dataIndex: 'useStartTime',
      render: (val, row) => {
        const { useStartTime, useEndTime, useTimeRule, delayDays, activeDays } = row;
        if (!useTimeRule) return '';
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
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '发布时间',
      dataIndex: 'createTime',
    },
    {
      type: 'handle',
      dataIndex: 'specialGoodsId',
      width: 100,
      render: (val, record, index) => {
        const { specialGoodsId, status } = record;
        return [
          {
            type: 'info',
            click: () => fetchSpecialGoodsDetail(index, 'info'),
          },
          {
            type: 'down',
            visible: status !== '0',
            click: () => fetchSpecialGoodsStatus(record),
          },
          {
            type: 'edit',
            visible: status !== '0',
            click: () => fetchSpecialGoodsDetail(index, [false, 'active', 'edit'][status]),
          },
          {
            pop: true,
            title: '取消推荐',
            auth: 'placement',
            visible: record.recommendStatus !== '0' || record.topStatus !== '0',
            click: () => fetchSpecialGoodsRecommend({ specialGoodsId, operationFlag: 'cancel' }),
          },
        ];
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

  // 获取详情
  const fetchSpecialGoodsDetail = (index, type) => {
    const { specialGoodsId, merchantIdStr, merchantName, ownerType } = list[index];
    dispatch({
      type: 'specialGoods/fetchSpecialGoodsDetail',
      payload: { specialGoodsId, merchantIdStr, type },
      callback: (val) => {
        const { status } = val;
        const newProps = {
          show: true,
          detail: { ...val, merchantName, ownerType, specialGoodsId, merchantIdStr },
        };
        if (type == 'info') {
          setVisibleInfo({ status, index, ...newProps });
        } else {
          setVisibleSet({ type, ...newProps });
        }
      },
    });
  };

  //导出列表
  const getExcelProps = {
    fieldNames: { key: 'key', headerName: 'header' },
    header: [
      { key: 'goodsType', header: '商品类型', render: (val) => GOODS_CLASS_TYPE[val] },
      { key: 'goodsName', header: '商品名称' },
      { key: 'ownerType', header: '店铺类型', render: (val) => BUSINESS_TYPE[val] },
      { key: 'merchantName', header: '店铺名称' },
      { key: 'oriPrice', header: '原价' },
      { key: 'realPrice', header: '特惠价格' },
      { key: 'merchantPrice', header: '商家结算价' },
      {
        key: 'useStartTime',
        header: '使用有效期',
        render: (val, row) => {
          const { useStartTime, useEndTime, useTimeRule, delayDays, activeDays } = row;
          if (!useTimeRule) return '';
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
      { key: 'total', header: '投放总量' },
      { key: 'remain', header: '剩余数量' },
      { key: 'soldGoodsCount', header: '销量' },
      {
        key: 'writeOffGoodsCount',
        header: '核销数量',
      },
      { key: 'createTime', header: '创建时间' },
      { key: 'status', header: '状态', render: (val) => SPECIAL_STATUS[val] },
    ],
  };

  return (
    <>
      <TableDataBlock
        keepData
        btnExtra={({ get }) => (
          <>
            <ExcelButton
              dispatchType={'specialGoods/fetchSpecialGoodsImport'}
              dispatchData={get()}
              exportProps={getExcelProps}
            ></ExcelButton>
          </>
        )}
        cardProps={{
          extra: (
            <Space>
              <AuthConsumer auth="save">
                <Button
                  className="dkl_green_btn"
                  onClick={() => setVisibleSet({ type: 'add', show: true })}
                >
                  新增
                </Button>
              </AuthConsumer>
            </Space>
          ),
        }}
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.specialGoodsId}`}
        rowSelection={{
          onChange: setGoodsList,
        }}
        // dispatchType="specialGoods/fetchGetList"
        {...specialGoods}
      ></TableDataBlock>
      <PreferentialDrawer
        childRef={childRef}
        visible={visibleSet}
        onClose={() => setVisibleSet({ show: false })}
      ></PreferentialDrawer>
      {/* 详情 */}
      <PlatformRightsDetail
        visible={visibleInfo}
        total={list.length}
        getDetail={fetchSpecialGoodsDetail}
        onEdit={() =>
          setVisibleSet({
            type: [false, 'active', 'edit'][visibleInfo.status],
            show: true,
            detail: visibleInfo ? visibleInfo.detail : {},
          })
        }
        onClose={() => setVisibleInfo(false)}
      ></PlatformRightsDetail>
    </>
  );
};

export default connect(({ specialGoods, loading }) => ({
  specialGoods,
  loading: loading.models.specialGoods,
  loadings: loading,
}))(PlatformRights);
