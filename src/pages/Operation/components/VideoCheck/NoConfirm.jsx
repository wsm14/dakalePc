import React, { useRef } from 'react';
import { connect } from 'umi';
import TableDataBlock from '@/components/TableDataBlock';
// 待确认

const NoConfirm = (props) => {
  const { tabkey, globalColum = [], globalSearch, loading, videoCheck } = props;
  const childRef = useRef();

  const searchItems = [...globalSearch];

  const getColumns = [...globalColum];

  return (
    <TableDataBlock
      noCard={false}
      cRef={childRef}
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

export default connect(({ videoCheck, baseData, loading }) => ({
  videoCheck,
  hubData: baseData.hubData,
  loading: loading.models.videoCheck || loading.effects['baseData/fetchGetLogDetail'],
}))(NoConfirm);
