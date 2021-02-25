import React from 'react';
import DataTableBlock from '@/components/DataTableBlock';

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
      <DataTableBlock
        noCard={false}
        componentSize="small"
        columns={getColumns}
        rowKey={(record) => `${record.userMerchantIdString}`}
        rowSelection={{
          selectedRowKeys: keys,
          onChange: (val) => setMreList({ list, keys: val }),
        }}
        list={list}
        total={list.length}
      ></DataTableBlock>
    </div>
  );
};

export default MreSelectShow;
