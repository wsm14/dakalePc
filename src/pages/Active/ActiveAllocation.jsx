import React from 'react';
import { connect } from 'dva';

const ActiveAllocation = (props) => {
  const { activeAllocation, loading, dispatch } = props;

  return '活动配置';
};

export default connect(({ activeAllocation, loading }) => ({
  activeAllocation,
  loading: loading.models.activeAllocation,
}))(ActiveAllocation);
