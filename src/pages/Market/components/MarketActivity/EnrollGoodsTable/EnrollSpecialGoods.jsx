import React, { useEffect } from 'react';
import { connect } from 'umi';
import { Tag } from 'antd';
import { BUSINESS_TYPE, BUSINESS_SALE_TYPE, TAG_COLOR_TYPE } from '@/common/constant';
import Ellipsis from '@/components/Ellipsis';
import TableDataBlock from '@/components/TableDataBlock';
import NumberValueSet from '@/components/FormListCondition/NumberValueSet';

// 特惠商品
const EnrollSpecialGoods = (props) => {
  const { dispatch, id, tableRef, offlineGoods, tradeList, loading } = props;

  useEffect(() => {
    fetchTradeList();
  }, []);

  // 获取行业类目
  const fetchTradeList = () => {
    dispatch({
      type: 'sysTradeList/fetchGetList',
    });
  };

  // 搜索参数
  const searchItems = [
    {
      label: '所属店铺',
      name: 'relateId',
      type: 'merchant',
    },
    {
      label: '商品名称',
      name: 'goodsName',
    },

    {
      label: '所属行业',
      name: 'categoryId',
      type: 'cascader',
      select: tradeList,
      fieldNames: { label: 'categoryName', value: 'categoryIdString', children: 'categoryDTOList' },
    },
  ];

  const getColumns = [
    {
      title: '店铺名称',
      dataIndex: 'relateName',
      render: (val, row) => (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <Tag color={TAG_COLOR_TYPE[val]}>{BUSINESS_TYPE[row.relateType]}</Tag>
          <Ellipsis tooltip length={8} style={{ marginLeft: 5 }}>
            {val}
          </Ellipsis>
        </div>
      ),
    },
    {
      title: '参与活动商品名称/ID',
      dataIndex: 'goodsName',
      render: (val, row) => (
        <div>
          <Ellipsis length={13} tooltip>
            {val}
          </Ellipsis>
          <div style={{ marginTop: 5 }}>{row.goodsId}</div>
        </div>
      ),
    },
    {
      title: '所属行业',
      dataIndex: 'categoryName',
    },
    {
      title: '活动时间',
      align: 'right',
      dataIndex: 'activityTimeRule',
      render: (val, row) =>
        ({ fixed: `${row.activityStartDate}\n~${row.activityEndDate}`, infinite: '长期' }[val]),
    },
    {
      title: '当前售价',
      align: 'right',
      dataIndex: 'sellPrice',
      render: (val, row) =>
        `${
          { defaultMode: val, cashMode: val, self: `${val}+${row.sellBean}`, free: '免费' }[
            row.payType
          ]
        }\n${BUSINESS_SALE_TYPE[row.payType]}`,
    },
    {
      title: '当前商家结算价',
      align: 'right',
      dataIndex: 'settlePrice',
    },
    {
      title: '活动售价',
      align: 'right',
      dataIndex: 'activitySellPrice',
      render: (val, row) => (
        <>
          <div>
            {
              {
                defaultMode: val,
                cashMode: val,
                self: `${val}+${row.activitySellBean}`,
                free: '免费',
              }[row.payType]
            }
          </div>
        </>
      ),
    },
    {
      title: '活动结算价',
      align: 'right',
      dataIndex: 'activitySettlePrice',
    },
    {
      title: '活动库存',
      align: 'right',
      dataIndex: 'activityRemain',
      render: (val, row) => (
        <NumberValueSet
          value={val}
          valueKey="activityRemain"
          loading={loading}
          inputProps={{ min: 0, precision: 0 }}
          onSubmit={(number) => fetchUpdateRemain(number)}
        ></NumberValueSet>
      ),
    },
  ];

  // 修改库存
  const fetchUpdateRemain = (values) => {
    dispatch({
      type: 'marketActivity/fetchMarketActivityGoodsEditRemain',
      payload: {
        ...values,
        marketingActivityId: id,
        goodsType: 'specialGoods',
      },
    });
  };

  return (
    <TableDataBlock
      order
      noCard={false}
      cRef={tableRef}
      loading={loading}
      tableSize="small"
      scroll={{ y: 400 }}
      columns={getColumns}
      searchItems={searchItems}
      rowKey={(row) => `${row.goodsId}`}
      params={{ marketingActivityId: id }}
      dispatchType="marketActivity/fetchMarketActivityOfflineGoods"
      {...offlineGoods}
    ></TableDataBlock>
  );
};

export default connect(({ sysTradeList, marketActivity, loading }) => ({
  tradeList: sysTradeList.list.list,
  offlineGoods: marketActivity.offlineGoods,
  loading:
    loading.effects['marketActivity/fetchMarketActivityOfflineGoods'] ||
    loading.effects['marketActivity/fetchMarketActivityGoodsEditRemain'],
}))(EnrollSpecialGoods);
