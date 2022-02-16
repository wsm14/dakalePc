import React from 'react';
import TableDataBlock from '@/components/TableDataBlock';

const SetMealTable = (props) => {
  const { packageGroupObjects } = props;
  const getColumns = [
    {
      title: '单品名称',
      dataIndex: 'goodsName',
    },
    {
      title: '份数',
      dataIndex: 'goodsNum',
    },
    {
      title: '价格',
      dataIndex: 'goodsPrice',
    },
  ];
  return packageGroupObjects.map((items, ins) => {
    const data = { list: items.packageGoodsObjects };
    return (
      <div key={ins}>
        <div style={{ marginBottom: '10px' }}>单品组名称： {items.groupName}</div>
        <TableDataBlock
          noCard={false}
          columns={getColumns}
          rowKey={(record) => `${record.goodsName}` + (0.5 - Math.random()).toString()}
          {...data}
        ></TableDataBlock>
      </div>
    );
  });
};
export default SetMealTable;
