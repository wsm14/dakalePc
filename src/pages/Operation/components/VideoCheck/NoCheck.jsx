import React from 'react';
import { connect } from 'umi';
import TableDataBlock from '@/components/TableDataBlock';

// 待审核
const NoCheck = (props) => {
  const { tabkey, globalColum = [], globalSearch, loading, videoCheck, tableRef } = props;

  const searchItems = [...globalSearch];

  const getColumns = [...globalColum];

  return (
    <TableDataBlock
      noCard={false}
      cRef={tableRef}
      loading={loading}
      columns={getColumns}
      searchItems={searchItems}
      rowKey={(record) => `${record.auditIdString}`}
      dispatchType="videoCheck/fetchGetList"
      params={{ auditSearchType: tabkey }}
      {...videoCheck}
    ></TableDataBlock>
  );
};

export default connect(({ videoCheck, loading }) => ({
  videoCheck,
  loading: loading.models.videoCheck || loading.effects['baseData/fetchGetLogDetail'],
}))(NoCheck);
