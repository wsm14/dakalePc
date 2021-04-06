import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { Tag, Button } from 'antd';
import {
  BUSINESS_TYPE,
  SPECIAL_STATUS,
  GOODS_CLASS_TYPE,
  SPECIAL_USERTIME_TYPE,
  SPECIAL_RECOMMEND_TYPE,
  SPECIAL_RECOMMEND_LISTTYPE,
} from '@/common/constant';
import Ellipsis from '@/components/Ellipsis';
import AuthConsumer from '@/layouts/AuthConsumer';
import PopImgShow from '@/components/PopImgShow';
import HandleSetTable from '@/components/HandleSetTable';
import TableDataBlock from '@/components/TableDataBlock';
import SpecialGoodsTrade from './components/SpecialGoods/SpecialGoodsTrade';
import SpecialRecommendMenu from './components/SpecialGoods/SpecialRecommendMenu';
import PreferentialDrawer from './components/SpecialGoods/PreferentialDrawer';

const SpecialGoods = (props) => {
  const { specialGoods, loading, loadings, hubData, dispatch } = props;

  const childRef = useRef();
  const [visible, setVisible] = useState(false);
  const [visibleSet, setVisibleSet] = useState(false); // 新增特惠活动
  const [searchType, setSearchType] = useState(null); // 搜索类型
  const [goodsList, setGoodsList] = useState([]); // 选择推荐的商品

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
      label: '活动状态',
      name: 'status',
      type: 'select',
      select: SPECIAL_STATUS,
    },
    {
      label: '活动有效期',
      type: 'rangePicker',
      name: 'activityStartTime',
      end: 'activityEndTime',
    },
    {
      label: '使用有效期',
      type: 'select',
      name: 'useTimeRule',
      allItem: false,
      select: SPECIAL_USERTIME_TYPE,
      handle: (form) => ({
        onChange: (val) => {
          console.log(val);
          setSearchType(val);
          form.setFieldsValue({ gain: undefined });
        },
      }),
    },
    {
      label: '有效期',
      name: { gain: 'activeDays', fixed: 'useStartTime' }[searchType],
      disabled: !searchType,
      type: { gain: 'number', fixed: 'rangePicker' }[searchType],
      end: 'useEndTime',
    },
    {
      label: '集团/店铺名称',
      name: 'groupOrMerchantName',
    },
    {
      label: '推广位置',
      type: 'select',
      name: 'promotionLocation',
      select: search_recommend,
    },
    {
      label: '活动商品名称',
      name: 'goodsName',
    },
    {
      label: '区域',
      name: 'city',
      type: 'cascader',
      changeOnSelect: true,
      valuesKey: ['provinceCode', 'cityCode', 'districtCode'],
      onChange: (val) => val.length === 3 && fetchGetHubSelect(val[2]),
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
    {
      label: '店铺类型',
      name: 'ownerType',
      type: 'select',
      select: BUSINESS_TYPE,
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
      dataIndex: 'activityStartTime',
      render: (val, row) => (
        <>
          {row.activityTimeRule === 'infinite'
            ? `${row.createTime} ~ 长期`
            : `${val} ~ ${row.activityEndTime}`}
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
      render: (val, row) => {
        if ((row.recommendStatus === '0' && (row.topStatus === '0' || !row.topStatus)) || !val)
          return '';
        let tagName = row.topStatus === '0' ? '推荐' : '置顶';
        return SPECIAL_RECOMMEND_LISTTYPE[val] + tagName;
      },
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
        const { specialGoodsId, status } = record;
        return (
          <HandleSetTable
            formItems={[
              {
                type: 'down',
                visible: status !== '0',
                click: () => fetchSpecialGoodsStatus(record),
              },
              {
                type: 'edit',
                visible: status !== '0',
                click: () => fetchSpecialGoodsDetail(record, [false, 'active', 'edit'][status]),
              },
              {
                pop: true,
                title: '取消推荐',
                auth: 'placement',
                visible: record.recommendStatus !== '0' || record.topStatus !== '0',
                click: () =>
                  fetchSpecialGoodsRecommend({ specialGoodsId, operationFlag: 'cancel' }),
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

  // 获取详情
  const fetchSpecialGoodsDetail = (payload, type) => {
    const { specialGoodsId, merchantIdStr, merchantName, ownerType } = payload;
    dispatch({
      type: 'specialGoods/fetchSpecialGoodsDetail',
      payload: { specialGoodsId, merchantIdStr, type },
      callback: (val) =>
        setVisibleSet({
          type,
          show: true,
          detail: { ...val, merchantName, ownerType, specialGoodsId, merchantIdStr },
        }),
    });
  };

  return (
    <>
      <TableDataBlock
        keepData
        cRef={childRef}
        btnExtra={
          <>
            <SpecialRecommendMenu
              num={goodsList.length}
              handleRecommend={(val) =>
                fetchSpecialGoodsRecommend({ specialGoodsId: goodsList.toString(), ...val })
              }
              disabled={!goodsList.length}
            ></SpecialRecommendMenu>
            <AuthConsumer auth="save">
              <Button
                className="dkl_green_btn"
                onClick={() => setVisibleSet({ type: 'add', show: true })}
              >
                新增
              </Button>
            </AuthConsumer>
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
      <PreferentialDrawer
        childRef={childRef}
        visible={visibleSet}
        onClose={() => setVisibleSet({ show: false })}
      ></PreferentialDrawer>
    </>
  );
};

export default connect(({ specialGoods, baseData, loading }) => ({
  specialGoods,
  hubData: baseData.hubData,
  loading: loading.models.specialGoods,
  loadings: loading,
}))(SpecialGoods);
