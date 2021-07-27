import React, { useState } from 'react';
import { connect } from 'umi';
import { BUSINESS_TYPE, SPECIAL_STATUS } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';

const NoConfirm = (props) => {
  const {
    tableRef,
    tabkey,
    globalColum = [],
    globalSearch,
    loading,
    couponAudit,
    rowHandle,
  } = props;

  const searchItems = [...globalSearch];

  const getColumns = [...globalColum, ...rowHandle];

  return (
    <TableDataBlock
      cRef={tableRef}
      loading={loading}
      columns={getColumns}
      searchItems={searchItems}
      params={{ auditSearchType: tabkey }}
      rowKey={(record) => `${record.auditIdString}`}
      dispatchType="couponAudit/fetchGetList"
      {...couponAudit}
    ></TableDataBlock>
  );
};

export default connect(({ couponAudit, baseData, loading }) => ({
  couponAudit,
  hubData: baseData.hubData,
  loading: loading.models.couponAudit || loading.effects['baseData/fetchGetLogDetail'],
}))(NoConfirm);
