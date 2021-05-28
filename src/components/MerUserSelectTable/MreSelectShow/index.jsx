import React from 'react';
import TableDataBlock from '@/components/TableDataBlock';

const MreSelectShow = ({ keys = [], list = [], setMreList, otherColumns = [] }) => {
  // table 表头
  const getColumns = [
    {
      title: '店铺名称',
      dataIndex: 'merchantName',
      width: 200,
      ellipsis: { lines: 2 },
    },
    {
      title: '经营类目',
      dataIndex: 'topCategoryName',
    },
    {
      title: '地区',
      dataIndex: 'provinceName',
      render: (val, record) => `${val}-${record.cityName}-${record.districtName}`,
    },
    {
      title: '详细地址',
      dataIndex: 'address',
      width: 200,
      ellipsis: { lines: 2 },
    },
    ...otherColumns,
  ];

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
