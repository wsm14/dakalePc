import React from 'react';
import TableDataBlock from '@/components/TableDataBlock';
import PopImgShow from '@/components/PopImgShow';

const SkuListTable = (props) => {
  const {} = props;

  // table 表头
  const getColumns = [
    {
      title: 'SKU码',
      dataIndex: 'skuCode',
    },
    {
      title: '图片',
      dataIndex: 'image',
      render: (val) => <PopImgShow url={val} />,
    },
    {
      title: '原价',
      dataIndex: 'oriPrice',
    },
    {
      title: '结算价',
      dataIndex: 'settlePrice',
    },
    {
      title: '零售价',
      dataIndex: 'sellPrice',
    },
    {
      title: '商品库存',
      dataIndex: 'initStock',
    },
  ];

  return (
    <TableDataBlock
      noCard={false}
      columns={getColumns}
      rowKey={(record, index) => `${index}`}
      list={[]}
    ></TableDataBlock>
  );
};

export default SkuListTable;
