import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Empty } from 'antd';
import TableDataBlock from '@/components/TableDataBlock';
import { SELL_ORDER_TYPE } from '@/common/constant';

const MarketStatement = (props) => {
  const { loading, orderList, sum, dispatch } = props;
  const [searchData, setSearchData] = useState({});

  useEffect(() => {
    dispatch({
      type: 'marketStatement/clearOrderList',
    });
  }, []);

  // 搜索参数
  const searchItems = [
    {
      label: '统计时间',
      name: 'startStatisticDay',
      type: 'rangePicker',
      end: 'endStatisticDay',
    },
    {
      label: '订单类型',
      name: 'orderType',
      type: 'select',
      select: SELL_ORDER_TYPE,
      allItem: false,
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '日期',
      dataIndex: 'saleDay',
    },
    {
      title: '订单类型',
      dataIndex: 'orderType',
      render: (val) => SELL_ORDER_TYPE[val],
    },
    {
      title: '下单数',
      dataIndex: 'totalPlaceOrderAmount',
      render: (val, row) =>
        ['scan', 'platformGift', 'virtualProduct'].includes(row.orderType) ? '' : val,
    },
    {
      title: '下单金额',
      dataIndex: 'totalPlaceOrderFee',
      render: (val, row) =>
        ['scan', 'platformGift', 'virtualProduct'].includes(row.orderType) ? '' : `￥${val}`,
    },
    {
      title: '支付订单数',
      dataIndex: 'totalPaidOrderAmount',
    },
    {
      title: '支付用户数',
      dataIndex: 'totalPaidUserAmount',
    },
    {
      title: '支付订单金额',
      dataIndex: 'totalPaidOrderFee',
      render: (val) => `￥${val}`,
    },
    {
      title: '卡豆抵扣金额',
      dataIndex: 'totalBeanReduceAmount',
      render: (val, row) => (row.orderType === 'weeklyCard' ? '' : `￥${(val / 100).toFixed(2)}`),
    },
    {
      title: '客单价',
      dataIndex: 'totalCustomerPrice',
      render: (val) => `￥${val}`,
    },
    {
      title: '取消订单数',
      dataIndex: 'totalCancelOrderAmount',
      render: (val, row) =>
        ['scan', 'platformGift', 'virtualProduct'].includes(row.orderType) ? '' : val,
    },
    {
      title: '取消订单金额',
      dataIndex: 'totalCancelOrderFee',
      render: (val, row) =>
        ['scan', 'platformGift', 'virtualProduct'].includes(row.orderType) ? '' : `￥${val}`,
    },
    {
      title: '核销商品数',
      dataIndex: 'totalVerificationAmount',
      render: (val, row) =>
        [
          'communityGoods',
          'scan',
          'virtualProduct',
          'commerceGoods',
          'weeklyCard',
          'platformGift',
        ].includes(row.orderType)
          ? ''
          : val,
    },
    {
      title: '核销金额',
      dataIndex: 'totalVerificationFee',
      render: (val, row) =>
        [
          'communityGoods',
          'scan',
          'virtualProduct',
          'commerceGoods',
          'weeklyCard',
          'platformGift',
        ].includes(row.orderType)
          ? ''
          : `￥${val}`,
    },
    {
      title: '退款商品数',
      dataIndex: 'totalRefundAmount',
      render: (val, row) =>
        [
          'communityGoods',
          'scan',
          'virtualProduct',
          'commerceGoods',
          'weeklyCard',
          'platformGift',
          'channelGoods',
        ].includes(row.orderType)
          ? ''
          : val,
    },
    {
      title: '退款金额',
      dataIndex: 'totalRefundFee',
      render: (val, row) =>
        [
          'communityGoods',
          'scan',
          'virtualProduct',
          'commerceGoods',
          'weeklyCard',
          'platformGift',
          'channelGoods',
        ].includes(row.orderType)
          ? ''
          : `￥${val}`,
    },
  ];

  return (
    <div>
      <TableDataBlock
        firstFetch={false}
        searchItems={searchItems}
        columns={getColumns}
        loading={loading}
        locale={{
          emptyText: (
            <Empty
              description={
                Object.keys(searchData).length > 1 ? ( // 因为有一个limit：50
                  '暂无数据'
                ) : (
                  <div style={{ fontSize: 26 }}>请先筛选统计时间</div>
                )
              }
            ></Empty>
          ),
        }}
        content={`累计支付金额：￥${sum.totalPaidOrderFee || '0.00'} 累计卡豆抵扣金额：￥${
          sum.totalBeanReduceAmount / 100 || '0.00'
        }`}
        searchCallback={(obj) => setSearchData(obj)}
        params={{ limit: 50 }}
        rowKey={(record) => `${record.saleDay}${record.orderType}`}
        dispatchType="marketStatement/fetchOrderSalesAnalysisReport"
        {...orderList}
      ></TableDataBlock>
    </div>
  );
};

export default connect(({ marketStatement, loading }) => ({
  orderList: marketStatement.orderList,
  sum: marketStatement.sum,
  loading: loading.effects['marketStatement/fetchOrderSalesAnalysisReport'],
}))(MarketStatement);
