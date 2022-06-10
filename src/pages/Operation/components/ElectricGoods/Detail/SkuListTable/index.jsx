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
      fixed: true,
      show: customSize.length != 0,
    },
    {
      title: `${customSize.map((item) => item.name).join('/')}`,
      dataIndex: type == 'info' ? 'attributes' : 'skuAttributeResps',
      fixed: true,
      render: (val) => val.map((item) => item.value).join('/'),
      show: customSize.length != 0,
    },
    {
      title: '图片',
      dataIndex: 'image',
      show: type == 'info',
      render: (val) => <PopImgShow width={60} url={val} />,
    },
    {
      title: '最小起订量',
      align: 'right',
      width: 120,
      dataIndex: 'minPurchaseNum',
      show: type == 'info' && sellType == 'batch',
    },
    {
      title: '原价',
      align: 'right',
      width: 120,
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
      align: 'right',
      width: 120,
      render: (val) => `￥${val}`,
      show: type == 'info' && sellType == 'single',
    },
    {
      title: '零售价',
      dataIndex: 'sellPrice',
      align: 'right',
      width: 120,
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
      align: 'right',
      width: 120,
      render: (val) => `￥${val}`,
      show: type == 'info' && sellType == 'single',
    },
    {
      title: '佣金',
      dataIndex: 'commission',
      align: 'right',
      width: 120,
      show: type == 'listSee' && sellType == 'single',
      render: (val, row) => `￥${val}`,
    },
    {
      title: '商品库存',
      align: 'right',
      width: 120,
      dataIndex: type == 'info' ? 'initStock' : 'remain',
    },
  ];

  return (
    <TableDataBlock
      tableLayout={'fixed'}
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
