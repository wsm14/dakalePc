import React from 'react';
import { InputNumber } from 'antd';
import { delectProps } from '../utils';

const InputNumberBlock = (props) => {
  
  const divProps = delectProps(props);

  return <InputNumber style={{ width: '100%' }} {...divProps} />;
};

export default InputNumberBlock;
