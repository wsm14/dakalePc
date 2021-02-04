import React from 'react';
import TableDataBlock from '@/components/TableDataBlock';

const MreSelectShow = ({ keys = [], list = [], setMreList }) => {
  // table 表头
  const getColumns = [
    {
      title: '店铺名称',
      dataIndex: 'merchantName',
    },
    {
      title: '详细地址',
      dataIndex: 'address',
    },
  ];

  console.log(keys);

  return (
    <div style={{ marginBottom: 20 }} key="table">
      <TableDataBlock
        noCard={false}
        size="small"
        columns={getColumns}
        rowKey={(record) => `${record.userMerchantIdString}`}
        rowSelection={{
          selectedRowKeys: keys,
          onChange: (val) => setMreList({ list, keys: val }),
        }}
        list={list}
        total={list.length}
      ></TableDataBlock>
    </div>
  );
};

export default MreSelectShow;
