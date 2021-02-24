import React from 'react';
import { Input } from 'antd';

/**
 * 输入框
 */

const InputBlock = (props) => {
  const { placeholder, label } = props;
  // 返回结果
  return (
    <Input
      placeholder={placeholder || `请输入${label}`}
      style={{ width: '100%' }}
      allowClear
      {...props}
    />
  );
};

export default InputBlock;
