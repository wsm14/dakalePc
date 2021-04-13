import React from 'react';
import TableDataBlock from '@/components/TableDataBlock';

const SetMealTable = (props) => {
  const getColumns = [
    {
      title: '单品名称',
      dataIndex: '',
    },
    {
        title: '份数',
        dataIndex: '',
      },
      {
        title: '价格',
        dataIndex: '',
      },
  ];
  return (
    <TableDataBlock
      columns={getColumns}
      rowKey={(record) => `${record.goodsIdString}`}
    ></TableDataBlock>
  );
};
export default SetMealTable;
