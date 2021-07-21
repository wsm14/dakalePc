import React, { useRef } from 'react';
import { connect } from 'umi';
import { REFUND_ORDERS_STATUS } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';
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
      label: '店铺',
      name: 'ownerId',
      type: 'merchant',
    },
    {
      label: '退款原因',
      name: 'refundReason',
    },
    {
      label: '区域',
      name: 'city',
      type: 'cascader',
      changeOnSelect: true,
      valuesKey: ['provinceCode', 'cityCode', 'districtCode'],
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
      select: REFUND_ORDERS_STATUS,
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
      ellipsis: true,
    },
    {
      title: '店铺名称',
      dataIndex: 'merchantName',
    },
    {
      title: '购买数量',
      align: 'right',
      dataIndex: 'goodsCount',
    },
    {
      title: '退款数量',
      align: 'right',
      dataIndex: 'refundCount',
    },
    {
      title: '退款金额',
      align: 'right',
      dataIndex: 'refundFee',
      render: (val, record) => `￥${val || 0} (含${record.refundBean ? record.refundBean : 0}卡豆)`,
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
      render: (val) => REFUND_ORDERS_STATUS[val],
    },
    {
      title: '退款完成时间',
      align: 'right',
      dataIndex: 'completeRefundTime',
    },
    {
      title: '操作',
      dataIndex: 'orderRefundId',
      align: 'right',
      fixed: 'right',
      render: (val, record) => <OrdersDetail order={val} name={record.goodsName}></OrdersDetail>,
    },
  ];

  return (
    <TableDataBlock
      keepData
      cRef={childRef}
      loading={loading}
      columns={getColumns}
      searchItems={searchItems}
      rowKey={(record) => `${record.orderRefundId}`}
      dispatchType="refundOrder/fetchGetList"
      {...refundOrder}
    ></TableDataBlock>
  );
};

export default connect(({ refundOrder, loading }) => ({
  refundOrder,
  loading: loading.effects['refundOrder/fetchGetList'],
}))(RefundOrder);
