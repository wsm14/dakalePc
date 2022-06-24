import React from 'react';
import { Form, InputNumber } from 'antd';
import TableDataBlock from '@/components/TableDataBlock';

// sku表单
const SkuTableForm = (props) => {
  const { list, pIndex, form, goodsType, discountMax } = props;

  // const data = form.getFieldValue(goodsType)[index] || {};

  // table 表头
  const getColumns = [
    {
      title: '模版名称',
      fixed: 'left',
      dataIndex: 'activityName',
    },
    {
      title: '创建时间',
      fixed: 'left',
      dataIndex: 'createTime',
    },
    {
      title: '创建人',
      fixed: 'left',
      dataIndex: 'creator',
      render: (val, row, rowIndex) => (
        <Form.Item
          label=""
          name={[rowIndex, 'discount']}
          style={{ marginBottom: 0 }}
          rules={[{ required: true, message: '请输入活动折扣' }]}
        >
          <InputNumber
            min={0}
            precision={0}
            // max={discountMax}
            addonAfter={'折'}
            style={{ width: 120 }}
            placeholder="请输入活动折扣"
          ></InputNumber>
        </Form.Item>
      ),
    },
  ];

  return (
    <div style={{ marginBottom: 16 }}>
      <TableDataBlock
        list={list}
        noCard={false}
        tableSize="small"
        pagination={false}
        columns={getColumns}
        rowKey={(record) => `${record.activityTemplateId}`}
      ></TableDataBlock>
    </div>
  );
};

export default SkuTableForm;
