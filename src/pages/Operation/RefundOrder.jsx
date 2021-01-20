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
      name: 'merchantNames',
    },
    {
      label: '提交退款时间',
      type: 'rangePicker',
      name: 'verifiedBeginDate',
      end: 'verifiedEndDate',
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
      title: '退款数量',
      align: 'right',
      dataIndex: 'goodsCount',
    },
    {
      title: '退款总金额',
      align: 'right',
      dataIndex: 'goodsCount',
    },
    {
      title: '退款卡豆数',
      align: 'right',
      dataIndex: 'goodsCount',
    },
    {
      title: '退款现金',
      align: 'right',
      dataIndex: 'goodsCount',
    },
    {
      title: '提交退款时间',
      align: 'right',
      dataIndex: 'createTime',
    },
    {
      title: '退款原因',
      dataIndex: 'refundReason',
    },
    // {
    //   title: '处理时间',
    //   align: 'center',
    //   dataIndex: 'closeTime',
    // },
    {
      title: '状态',
      align: 'center',
      dataIndex: 'status',
      render: (val) => ORDERS_STATUS[val],
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
      rowKey={(record) => `${record.orderSn}`}
      dispatchType="refundOrder/fetchGetList"
      {...refundOrder}
    ></DataTableBlock>
  );
};

export default connect(({ refundOrder, loading }) => ({
  refundOrder,
  loading: loading.effects['refundOrder/fetchGetList'],
}))(RefundOrder);
