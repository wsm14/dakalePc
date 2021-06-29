import React, {  useState } from 'react';
import { connect } from 'umi';
import { CHECK_STATUS,GOODS_CHECK_RESSTATUS } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';

// 已确认
const AlConfirm = (props) => {
  const { tableRef,tabkey, globalColum = [], globalSearch, loading, specialGoodsCheck ,rowHandle} = props;

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
    ...globalColum,
    {
      title: '审核时间',
      dataIndex: 'checkTime',
    },
    {
      title: '审核结果',
      dataIndex: 'auditStatus',
      render:(val)=>GOODS_CHECK_RESSTATUS[val]
    },
    {
      title: '驳回原因',
      dataIndex: 'rejectReason',
    },
    ...rowHandle,
  ];

  return (

    <TableDataBlock
      cRef={tableRef}
      loading={loading}
      columns={getColumns}
      searchItems={searchItems}
      rowKey={(record) => `${record.auditIdString}`}
      dispatchType="specialGoodsCheck/fetchGetList"
      params={{auditSearchType:tabkey}}
      {...specialGoodsCheck}
    ></TableDataBlock>
  );
};

export default connect(({ specialGoodsCheck, loading }) => ({
  specialGoodsCheck,
  loading: loading.models.specialGoodsCheck || loading.effects['baseData/fetchGetLogDetail'],
}))(AlConfirm);
