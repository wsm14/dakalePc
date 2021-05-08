import React from 'react';
import Ellipsis from '@/components/Ellipsis';
import TableDataBlock from '@/components/TableDataBlock';

const MreSelectShow = ({ keys = [], list = [], setMreList }) => {
  // table 表头
  const getColumns = [
    {
      title: '店铺名称',
      dataIndex: 'merchantName',
      width: 200,
      render: (val) => (
        <Ellipsis length={10} tooltip lines={2}>
          {val}
        </Ellipsis>
      ),
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
      render: (val) => (
        <Ellipsis length={10} tooltip lines={2}>
          {val}
        </Ellipsis>
      ),
    },
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
