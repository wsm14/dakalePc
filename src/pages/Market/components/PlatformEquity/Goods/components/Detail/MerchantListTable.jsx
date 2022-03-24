import React from 'react';
import TableDataBlock from '@/components/TableDataBlock';

const MerchantListTable = (props) => {
  const { merchantList } = props;
  const getColumns = [
    {
      title: '店铺名称',
      dataIndex: 'merchantName',
      ellipsis: true,
    },
    {
      title: '详细地址',
      dataIndex: 'address',
      ellipsis: true,
    },
  ];
  return (
    <TableDataBlock
      order
      columns={getColumns}
      rowKey={(record) => `${record.merchantName}` + (0.5 - Math.random()).toString()}
      list={merchantList}
    ></TableDataBlock>
  );
};
export default MerchantListTable;
