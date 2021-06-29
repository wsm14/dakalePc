import React from 'react';
import TableDataBlock from '@/components/TableDataBlock';
const CheckRecord = (props) => {
  const getColumns = [
    {
      title: '审核角色',
      dataIndex: 'categoryName',
    },
    {
      title: '审核结果',
      dataIndex: 'categoryName',
    },
    {
      title: '审核时间',
      dataIndex: 'categoryName',
    },
  ];
  return <TableDataBlock noCard={false} columns={getColumns} rowKey={(record) => `${record.id}`}></TableDataBlock>;
};
export default CheckRecord;
