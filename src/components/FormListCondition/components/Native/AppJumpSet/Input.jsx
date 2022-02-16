import React from 'react';
import { Form } from 'antd';
import { Input } from '@/components/FormCondition/formModule';

const FormItem = Form.Item;

/**
 * 活动
 * @param {Array} paramKey app跳转参数键值
 */
export default ({ paramKey }) => {
  return (
    <FormItem
      key={`activityInput${paramKey[0]}`}
      label="请输入参数"
      name={['param', paramKey[0]]}
      rules={[{ required: true, message: `请输入参数` }]}
      style={{ maxWidth: '100%' }}
    >
      <Input placeholder={'请输入参数'}></Input>
    </FormItem>
  );
};
