import React from 'react';
import { Form, InputNumber } from 'antd';
import TableDataBlock from '@/components/TableDataBlock';

const FormItemInput = ({ name, label = '', inputProps = {} }) => {
  return (
    <Form.Item
      label=""
      name={name}
      style={{ marginBottom: 0 }}
      rules={[{ required: true, message: `请输入${label}` }]}
    >
      <InputNumber
        min={0}
        precision={0}
        style={{ width: 100 }}
        placeholder="请输入"
        {...inputProps}
      ></InputNumber>
    </Form.Item>
  );
};

// sku表单
const SkuTableForm = (props) => {
  const { skuList, paymentModeType, pIndex, form, goodsType, discountMax } = props;

  // table 表头
  const getColumns = [
    {
      title: 'SKU码',
      dataIndex: 'skuCode',
    },
    {
      title: '规格值',
      dataIndex: 'skuAttributeResps',
      render: (val) => val.map((i) => `${i.name}:${i.value}`).join('\n'),
    },
    {
      title: '当前售价',
      align: 'right',
      dataIndex: 'sellPrice',
      render: (val, row) =>
        ({
          defaultMode: `￥${val}`,
          cashMode: `￥${val}`,
          self: `￥${val}+${row.sellBean}卡豆`,
          free: '免费',
        }[paymentModeType]),
    },
    {
      title: '当前结算价',
      align: 'right',
      dataIndex: 'settlePrice',
      render: (val, row) => `￥${val}`,
    },
    {
      title: '活动折扣（折）',
      dataIndex: 'sellBean',
      render: (val, row, rowIndex) => (
        <FormItemInput
          label="活动折扣"
          name={[rowIndex, 'discount']}
          inputProps={{ max: discountMax }}
        ></FormItemInput>
      ),
    },
    {
      title: '活动售价（卡豆）',
      dataIndex: 'totalSellPrice',
      render: (val, row, rowIndex) => (
        <FormItemInput label="活动卡豆" name={[rowIndex, 'activitySellBean']}></FormItemInput>
      ),
    },
    {
      title: '活动零售价',
      dataIndex: 'commission',
      render: (val, row, rowIndex) => (
        <FormItemInput
          label="活动零售价"
          name={[rowIndex, 'activitySellPrice']}
          inputProps={{ precision: 2 }}
        ></FormItemInput>
      ),
    },
    {
      title: '活动结算价',
      align: 'right',
      dataIndex: 'activitySettlePrice',
      render: (val, row) => `￥${val}`,
    },
    {
      title: '活动库存',
      dataIndex: 'skuId',
      render: (val, row, rowIndex) => (
        <FormItemInput label="活动折扣" name={[rowIndex, 'activityTotal']}></FormItemInput>
      ),
    },
  ];

  return (
    <div style={{ marginBottom: 16 }}>
      <TableDataBlock
        list={skuList}
        noCard={false}
        tableSize="small"
        pagination={false}
        columns={getColumns}
        rowKey={(record) => `${record.skuId}`}
      ></TableDataBlock>
    </div>
  );
};

export default SkuTableForm;
