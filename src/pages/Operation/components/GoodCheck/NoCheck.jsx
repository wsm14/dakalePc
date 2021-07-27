import React from 'react';
import { connect } from 'umi';
import TableDataBlock from '@/components/TableDataBlock';

// 待审核
const NoCheck = (props) => {
  const {
    tabkey,
    globalColum = [],
    globalSearch,
    loading,
    specialGoodsCheck,
    rowHandle,
    tableRef,
  } = props;

  const searchItems = [...globalSearch];

  const getColumns = [
    ...globalColum,
    ...rowHandle,
    // {
    //     type: 'handle',
    //     dataIndex: 'id',
    //     render: (val, record) => {
    //       const { merchantIdStr } = record;
    //       return [
    //         {
    //           type: 'check',
    //           title:"审核"
    //         },
    //       ];
    //     }
    // }
  ];

  return (
    <TableDataBlock
      noCard={false}
      cRef={tableRef}
      loading={loading}
      columns={getColumns}
      searchItems={searchItems}
      rowKey={(record) => `${record.auditIdString}`}
      dispatchType="specialGoodsCheck/fetchGetList"
      params={{ auditSearchType: tabkey }}
      {...specialGoodsCheck}
    ></TableDataBlock>
  );
};

export default connect(({ specialGoodsCheck, loading }) => ({
  specialGoodsCheck,
  loading: loading.models.specialGoodsCheck || loading.effects['baseData/fetchGetLogDetail'],
}))(NoCheck);
