import React from 'react';
import { InputNumber } from 'antd';

/**
 * 数字输入框
 */

const NumberBlock = (props) => {
  const { placeholder, label } = props;
  // 返回结果
  return (
    <InputNumber
      placeholder={placeholder || `请输入${label}`}
      style={{ width: '100%' }}
      allowClear
    />
  );
};

export default NumberBlock;
