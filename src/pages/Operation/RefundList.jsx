import React from 'react';
import { connect } from 'umi';

const RefundList = () => {
  return <div>RefundList</div>;
};

export default connect(({ refundOrder, loading }) => ({
  refundOrder,
  loading: loading.effects['refundOrder/fetchGetList'],
}))(RefundList);
