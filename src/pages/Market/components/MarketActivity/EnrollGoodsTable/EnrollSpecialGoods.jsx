import React, { useRef, useEffect } from 'react';
import { connect } from 'umi';
import { Tag } from 'antd';
import { BUSINESS_TYPE, BUSINESS_SALE_TYPE } from '@/common/constant';
import Ellipsis from '@/components/Ellipsis';
import TableDataBlock from '@/components/TableDataBlock';

// 特惠商品
const EnrollSpecialGoods = (props) => {
  const { dispatch, id, offlineGoods, tradeList, loading } = props;

  const childRef = useRef();

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
          <Tag>{BUSINESS_TYPE[row.relateType]}</Tag>
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
      render: (val, row) =>
        ({ defaultMode: val, cashMode: val, self: `${val}+${row.activitySellBean}`, free: '免费' }[
          row.payType
        ]),
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
    },
  ];

  return (
    <TableDataBlock
      order
      noCard={false}
      tableSize="small"
      scroll={{ y: 400 }}
      cRef={childRef}
      loading={loading}
      searchItems={searchItems}
      columns={getColumns}
      params={{ marketingActivityId: id }}
      rowKey={(row) => `${row.goodsId}`}
      dispatchType="marketActivity/fetchMarketActivityOfflineGoods"
      {...offlineGoods}
    ></TableDataBlock>
  );
};

export default connect(({ sysTradeList, marketActivity, loading }) => ({
  tradeList: sysTradeList.list.list,
  offlineGoods: marketActivity.offlineGoods,
  loading: loading.effects['marketActivity/fetchMarketActivityOfflineGoods'],
}))(EnrollSpecialGoods);
