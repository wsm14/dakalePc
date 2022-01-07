import React from 'react';
import { Form, Input } from 'antd';

const FormItem = Form.Item;

/**
 * 话费抵扣券包 / 平台通用券包 / 电商品券包
 * @param {Array} paramKey app跳转参数键值
 */
const GiftType = ({ paramKey }) => {
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
