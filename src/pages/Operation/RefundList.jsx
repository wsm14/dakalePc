import React, { useRef } from 'react';
import { connect } from 'umi';
import TableDataBlock from '@/components/TableDataBlock';

const RefundList = (props) => {
  const { loading, refundOrder } = props;

  const childRef = useRef();

  // 搜索参数
  const searchItems = [
    {
      label: '订单号',
      name: 'orderSn',
    },
    {
      label: '商品名称',
      name: 'orderSn',
    },
    {
      label: '申请时间',
      name: 'orderSn',
    },
    {
      label: '用户',
      name: 'orderSn',
    },
    {
      label: '店铺名称',
      name: 'orderSn',
    },
    {
      label: '审核结果',
      name: 'orderSn',
    },
    {
      label: '审核时间',
      name: 'orderSn',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '订单号',
      fixed: 'left',
      dataIndex: 'orderSn',
    },
  ];

  return (
    <TableDataBlock
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
}))(RefundList);
