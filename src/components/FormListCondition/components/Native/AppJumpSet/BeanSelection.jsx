import React from 'react';
import { Form } from 'antd';
import { Select } from '@/components/FormCondition/formModule';

const FormItem = Form.Item;

/**
 * 小豆精选
 * @param {Array} paramKey app跳转参数键值
 */
export default ({ paramKey }) => {
  return (
    <FormItem
      key={`isEveryDayPush`}
      label="是否每日推送"
      name={['param', paramKey[0]]}
      rules={[{ required: true, message: `请选择是否推送` }]}
      style={{ maxWidth: '100%' }}
    >
      <Select select={['否', '是']} placeholder={'请选择是否推送'}></Select>
    </FormItem>
  );
};
