import React from 'react';
import TableDataBlock from '@/components/TableDataBlock';
const CheckRecord = (props) => {
  const { list = [] } = props;

  const getColumns = [
    {
      title: '审核角色/结果',
      dataIndex: 'actionDesc',
    },
    {
      title: '审核时间',
      dataIndex: 'createTime',
    },
  ];
  return (
    <TableDataBlock
      noCard={false}
      columns={getColumns}
      rowKey={(record) => `${record.id}`}
      list={list}
    ></TableDataBlock>
  );
};
export default CheckRecord;
