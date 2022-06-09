import React from 'react';
import { Button, Popover } from 'antd';
import TableDataBlock from '@/components/TableDataBlock';
import PopImgShow from '@/components/PopImgShow';

const SkuListTable = (props) => {
  const { detail = {}, type = 'info' } = props;
  const { customSize = [], skuInfoReqs = [], sellType } = detail;

  const ladderTable = (row = []) => {
    const ladderColumns = [
      {
        title: '购买数',
        dataIndex: 'miniNum',
        render: (val) => `${val}个及以上`,
      },
      {
        title: '批采价',
        dataIndex: 'unitPrice',
        render: (val) => `￥${val}`,
      },
      {
        title: '结算价',
        dataIndex: 'settlePrice',
        render: (val) => `￥${val}`,
      },
    ];

    return (
      <TableDataBlock
        noCard={false}
        rowKey={(record, index) => `${record.miniNum}${index}`}
        pagination={false}
        columns={ladderColumns}
        list={row}
      ></TableDataBlock>
    );
  };

  // table 表头
  const getColumns = [
    {
      title: 'SKU码',
      dataIndex: 'skuCode',
      show: customSize.length != 0,
    },
    {
      title: `${customSize.map((item) => item.name).join('/')}`,
      dataIndex: type == 'info' ? 'attributes' : 'skuAttributeResps',
      render: (val) => val.map((item) => item.value).join('/'),
      show: customSize.length != 0,
    },
    {
      title: '图片',
      dataIndex: 'image',
      show: type == 'info',
      render: (val) => <PopImgShow url={val} />,
    },
    {
      title: '最小起订量',
      dataIndex: 'minPurchaseNum',
      show: type == 'info' && sellType == 'batch',
    },
    {
      title: '原价',
      dataIndex: 'oriPrice',
      show: type == 'info' || sellType == 'batch',
      render: (val) => `￥${val}`,
    },
    {
      title: '批采价',
      dataIndex: 'batchLadderObjects',
      show: sellType == 'batch',
      render: (val, row) => (
        <Popover
          placement="top"
          content={() => ladderTable(row?.batchLadderObjects || [])}
          trigger="click"
          destroyTooltipOnHide={true}
        >
          <Button type="link">查看</Button>
        </Popover>
      ),
    },
    {
      title: '成本价',
      dataIndex: 'costPrice',
      render: (val) => `￥${val}`,
      show: type == 'info' && sellType == 'single',
    },
    {
      title: '零售价',
      dataIndex: 'sellPrice',
      render: (val) => `￥${val}`,
      show: sellType == 'single',
    },
    {
      title: '结算价',
      dataIndex: 'settlePrice',
      render: (val) => `￥${val}`,
      show: type == 'info' && sellType == 'single',
    },
    {
      title: '佣金',
      dataIndex: 'commission',
      show: type == 'listSee' && sellType == 'single',
      render: (val, row) => `￥${val}`,
    },
    {
      title: '商品库存',
      dataIndex: type == 'info' ? 'initStock' : 'remain',
    },
  ];

  return (
    <TableDataBlock
      scroll={{ x: 'max-content', y: 400 }}
      noCard={false}
      columns={getColumns}
      rowKey={(record, index) => `${record.skuCode}${index}`}
      list={skuInfoReqs}
      total={skuInfoReqs.length || 0}
    ></TableDataBlock>
  );
};

export default SkuListTable;
