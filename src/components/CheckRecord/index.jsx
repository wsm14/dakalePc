import React from 'react';
import TableDataBlock from '@/components/TableDataBlock';
const CheckRecord = (props) => {
  const { recordList = {} } = props;

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
      rowKey={(record) => `${record.actionLogId}`}
      {...recordList}
    ></TableDataBlock>
  );
};
export default CheckRecord;
