import React, { useEffect, useState } from 'react';
import { connect } from 'umi';

const CrmGroupSelect = (props) => {
  const { dispatch } = props;

  return <>11</>;
};
export default connect(({ sysTradeList, loading }) => ({
  loading: loading.models.groupSet,
  tradeList: sysTradeList.list.list,
  categoryDTOList: sysTradeList.categoryDTOList,
}))(CrmGroupSelect);
