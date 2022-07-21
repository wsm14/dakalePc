import React from 'react';
import { Form, InputNumber, Tag } from 'antd';
import update from 'immutability-helper';
import TableDataBlock from '@/components/TableDataBlock';

const FormItemInput = ({ name, label = '', rules = [], inputProps = {} }) => {
  return (
    <Form.Item
      label=""
      name={name}
      style={{ marginBottom: 0 }}
      rules={[{ required: true, message: `请输入${label}` }, ...rules]}
    >
      <InputNumber
        min={0}
        precision={0}
        style={{ width: 90 }}
        placeholder="请输入"
        {...inputProps}
      ></InputNumber>
    </Form.Item>
  );
};

// sku表单
const SkuTableForm = (props) => {
  const { skuList, paymentModeType, pIndex, form, goodsType } = props;

  // 更新数据
  const updateData = (val, index) => {
    const listData = form.getFieldValue(goodsType) || [];
    const dataSkuList = form.getFieldValue([goodsType, pIndex, 'skuList']) || [];
    const skuData = update(dataSkuList, {
      $splice: [[index, 1, { ...(dataSkuList[index] || {}), ...val }]],
    });
    form.setFieldsValue({
      [goodsType]: update(listData, {
        $splice: [[pIndex, 1, { ...(listData[pIndex] || {}), skuList: skuData }]],
      }),
    });
  };

  // table 表头
  const getColumns = [
    {
      title: 'SKU码',
      fixed: 'left',
      dataIndex: 'skuCode',
    },
    {
      title: '规格值',
      fixed: 'left',
      dataIndex: 'skuAttributeResps',
      render: (val) => val.map((i) => `${i.name}: ${i.value}`).join('\n'),
    },
    {
      title: '当前售价',
      fixed: 'left',
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
      fixed: 'left',
      align: 'right',
      dataIndex: 'settlePrice',
      render: (val, row) => `￥${val}`,
    },
    {
      title: '秒杀价(卡豆)',
      dataIndex: 'sellBean',
      align: 'right',
      show: paymentModeType == 'self',
      render: (val, row, rowIndex) => {
        const maxPrice = Math.trunc(row.sellPrice * 100 + row.sellBean);
        return (
          <FormItemInput
            label="活动卡豆"
            name={[rowIndex, 'activitySellBean']}
            inputProps={{
              max: maxPrice,
              onChange: (e) => {
                updateData({ activitySellPrice: (maxPrice - e) / 100 }, rowIndex);
              },
            }}
          ></FormItemInput>
        );
      },
    },
    {
      title: '秒杀价',
      align: 'center',
      dataIndex: 'activitySellPrice',
      render: (val, row, rowIndex) => {
        const { activitySellBean = 0, sellBean = 0 } = row;
        const maxPrice = Number(row.sellPrice) + (sellBean - activitySellBean) / 100;
        return (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FormItemInput
              label="秒杀价"
              name={[rowIndex, 'activitySellPrice']}
              inputProps={{
                precision: 2,
                max: maxPrice,
              }}
            ></FormItemInput>
            <Tag color={'green'} style={{ marginLeft: 10 }}>
              折
            </Tag>
          </div>
        );
      },
    },
    {
      title: '秒杀库存',
      align: 'right',
      dataIndex: 'skuId',
      render: (val, row, rowIndex) => (
        <FormItemInput label="活动库存" name={[rowIndex, 'activityTotal']}></FormItemInput>
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
