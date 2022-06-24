import React from 'react';
import { Form, InputNumber } from 'antd';
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

  // 计算价格
  const countPrice = (val) => {
    return Number((val / 10 < 0.001 ? 0 : val / 10).toFixed(2));
  };

  // 更新数据
  const updateData = (val, index) => {
    const listData = form.getFieldValue(goodsType) || [];
    const skuData = update(skuList, {
      $splice: [[index, 1, { ...(skuList[index] || {}), ...val }]],
    });
    form.setFieldsValue({
      [goodsType]: update(listData, {
        $splice: [[pIndex, 1, { ...(listData[pIndex] || {}), skuList: skuData }]],
      }),
    });
  };

  // 校验价格是否相等折扣
  const checkPrice = (val, row, rowIndex) => {
    // 表单价格
    const formSellBean =
      form.getFieldValue([goodsType, pIndex, 'skuList', rowIndex, 'activitySellBean']) || 0;
    const { discount = 0, sellPrice, sellBean } = row;

    // 当前折扣后价格
    const newDisPrice =
      countPrice(discount * sellPrice) * 100 + Math.trunc((discount * sellBean) / 10);
    // 修改后折扣价格
    const editDisPrice = formSellBean + val * 100;

    if (newDisPrice !== editDisPrice) {
      return Promise.reject(new Error(`售价需=当前售价*${discount}折`));
    }
    return Promise.resolve();
  };

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
      title: `活动折扣（max ${discountMax}折）`,
      dataIndex: 'sellBean',
      render: (val, row, rowIndex) => {
        return (
          <FormItemInput
            label="活动折扣"
            name={[rowIndex, 'discount']}
            inputProps={{
              max: discountMax,
              onChange: (val) => {
                updateData(
                  {
                    discount: val,
                    activitySellBean: Math.trunc((val * row.sellBean) / 10),
                    activitySellPrice: countPrice(val * row.sellPrice),
                    activitySettlePrice: countPrice(val * row.settlePrice),
                  },
                  rowIndex,
                );
              },
            }}
          ></FormItemInput>
        );
      },
    },
    {
      title: '活动售价（卡豆）',
      dataIndex: 'totalSellPrice',
      show: paymentModeType == 'self',
      render: (val, row, rowIndex) => {
        const max =
          countPrice(row.discount * row.sellPrice) * 100 +
          Math.trunc((row.discount * row.sellBean) / 10);
        return (
          <FormItemInput
            label="活动卡豆"
            name={[rowIndex, 'activitySellBean']}
            inputProps={{
              max,
              onChange: (val) => {
                updateData(
                  {
                    activitySellBean: val,
                    activitySellPrice: (max - val) / 100,
                  },
                  rowIndex,
                );
              },
            }}
          ></FormItemInput>
        );
      },
    },
    {
      title: '活动零售价',
      dataIndex: 'commission',
      render: (val, row, rowIndex) => (
        <FormItemInput
          label="活动零售价"
          name={[rowIndex, 'activitySellPrice']}
          rules={[
            {
              validator: (_, value) => checkPrice(value, row, rowIndex),
            },
          ]}
          inputProps={{
            precision: 2,
            readOnly: paymentModeType !== 'self',
            bordered: paymentModeType == 'self',
          }}
        ></FormItemInput>
      ),
    },
    {
      title: '活动结算价',
      align: 'right',
      dataIndex: 'activitySettlePrice',
      render: (val, row) => `￥${val || 0}`,
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
