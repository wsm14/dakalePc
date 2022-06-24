import React from 'react';
import { Form, InputNumber } from 'antd';
import './index.less';

// sku表单
const SkuListForm = (props) => {
  const { index, form, goodsType, discountMax } = props;

  const data = form.getFieldValue(goodsType)[index] || {};

  return (
    <div style={{ marginBottom: 16 }}>
      <Form.Item
        label="活动折扣"
        name={[index, 'discount']}
        rules={[{ required: true, message: '请输入活动折扣' }]}
      >
        <InputNumber
          min={0}
          precision={0}
          max={discountMax}
          addonAfter={'折'}
          placeholder="请输入活动折扣"
        ></InputNumber>
      </Form.Item>
    </div>
  );
};

export default SkuListForm;
