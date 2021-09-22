import React from 'react';
import { connect } from 'umi';
import { GOODS_CHECK_RESSTATUS } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';

// 已确认
const AlConfirm = (props) => {
  const {
    tableRef,
    tabkey,
    globalColum = [],
    globalSearch,
    loading,
    videoCheck,
  } = props;

  const searchItems = [
    ...globalSearch,
    {
      label: '审核结果',
      name: 'auditStatus',
      type: 'select',
      select: GOODS_CHECK_RESSTATUS,
    },
  ];

  const getColumns = [
    ...globalColum
  ];

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
}))(AlConfirm);
