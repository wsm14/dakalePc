import React, { useRef } from 'react';
import { connect } from 'umi';
import { ORDERS_STATUS, REFUND_ORDERS_STATUS } from '@/common/constant';
import DataTableBlock from '@/components/DataTableBlock';
import OrdersDetail from './components/RefundOrder/OrdersDetail';

const RefundOrder = (props) => {
  const { refundOrder, loading } = props;

  const childRef = useRef();

  // 搜索参数
  const searchItems = [
    {
      label: '订单号',
      name: 'orderSn',
    },
    {
      label: '手机号',
      name: 'mobile',
    },
    {
      label: '店铺名',
      name: 'merchantName',
    },
    {
      label: '退款原因',
      name: 'refundReason',
    },
    {
      label: '提交退款时间',
      type: 'rangePicker',
      name: 'submitRefundTimeStart',
      end: 'submitRefundTimeEnd',
    },
    {
      label: '状态',
      type: 'select',
      name: 'status',
      select: {
        list: REFUND_ORDERS_STATUS,
      },
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '订单号',
      fixed: 'left',
      dataIndex: 'orderSn',
    },
    {
      title: '手机号',
      fixed: 'left',
      dataIndex: 'mobile',
    },
    {
      title: '购买商品',
      dataIndex: 'goodsName',
    },
    {
      title: '店铺名称',
      align: 'right',
      dataIndex: 'merchantName',
    },
    {
      title: '购买数量',
      align: 'right',
      dataIndex: 'goodsCount',
    },
    {
      title: '退款金额',
      align: 'right',
      dataIndex: 'refundFee',
      render: (val) => `￥${val}`,
    },
    {
      title: '退款卡豆数',
      align: 'right',
      dataIndex: 'refundBean',
    },
    {
      title: '提交退款时间',
      align: 'right',
      dataIndex: 'submitRefundTime',
    },
    {
      title: '退款原因',
      dataIndex: 'refundReason',
    },
    {
      title: '状态',
      align: 'center',
      dataIndex: 'status',
      render: (val) => ORDERS_STATUS[val],
    },
    {
      title: '退款完成时间',
      align: 'right',
      dataIndex: 'completeRefundTime',
    },
    {
      title: '操作',
      dataIndex: 'orderId',
      align: 'right',
      fixed: 'right',
      render: (val, record) => <OrdersDetail order={val} name={record.goodsName}></OrdersDetail>,
    },
  ];

  return (
    <DataTableBlock
      cRef={childRef}
      loading={loading}
      columns={getColumns}
      searchItems={searchItems}
      rowKey={(record) => `${record.orderId}`}
      dispatchType="refundOrder/fetchGetList"
      {...refundOrder}
    ></DataTableBlock>
  );
};

export default connect(({ refundOrder, loading }) => ({
  refundOrder,
  loading: loading.effects['refundOrder/fetchGetList'],
}))(RefundOrder);
