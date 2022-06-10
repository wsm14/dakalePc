import React from 'react';
import { Button, Popover } from 'antd';
import TableDataBlock from '@/components/TableDataBlock';
import PopImgShow from '@/components/PopImgShow';

const SkuListTable = (props) => {
  const { detail = {}, type = 'info' } = props;
  const { customSize = [], skuInfoReqs = [], sellType, paymentModeType } = detail;

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
        align: 'right',
        render: (val) => `￥${val}`,
      },
      {
        title: '结算价',
        dataIndex: 'settlePrice',
        align: 'right',
        render: (val) => `￥${val}`,
      },
    ];

    return (
      <TableDataBlock
        tableSize="small"
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
      align: 'right',
      dataIndex: 'minPurchaseNum',
      show: type == 'info' && sellType == 'batch',
    },
    {
      title: '原价',
      align: 'right',
      dataIndex: 'oriPrice',
      show: type == 'info' || sellType == 'batch',
      render: (val) => `￥${val}`,
    },
    {
      title: '批采价',
      dataIndex: 'batchLadderObjects',
      align: 'right',
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
      align: 'right',
      render: (val) => `￥${val}`,
      show: type == 'info' && sellType == 'single',
    },
    {
      title: '零售价',
      dataIndex: 'sellPrice',
      align: 'right',
      show: sellType == 'single',
      render: (val, row) =>
        paymentModeType == 'self'
          ? `￥${val}+${row.sellBean}卡豆`
          : paymentModeType == 'free'
          ? '免费'
          : `￥${val}`,
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
      align: 'right',
      show: type == 'listSee' && sellType == 'single',
      render: (val, row) => `￥${val}`,
    },
    {
      title: '商品库存',
      align: 'right',
      dataIndex: type == 'info' ? 'initStock' : 'remain',
    },
  ];

  return (
    <TableDataBlock
      tableSize="small"
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
