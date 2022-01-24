import React from 'react';
import { Form, Input } from 'antd';

const FormItem = Form.Item;

/**
 * 小豆精选
 * @param {Array} paramKey app跳转参数键值
 */
const GiftType = ({ paramKey, showApi }) => {
  return (
    <FormItem
      key={`giftType`}
      hidden={true}
      name={['param', paramKey[0]]}
      style={{ maxWidth: '100%' }}
    >
      <Input></Input>
    </FormItem>
  );
};

export default GiftType;
