import React from 'react';
import { InputNumber } from 'antd';
import { delectProps } from '../utils';

const InputNumberBlock = (props) => {
  const { suffix, style, ...ohter } = props;
  const divProps = delectProps(ohter);
  return (
    <>
      <InputNumber style={{ width: suffix ? '75%' : '100%', ...style }} {...divProps} />
      {suffix && <span style={{ marginLeft: 10 }}>{suffix}</span>}
    </>
  );
};

export default InputNumberBlock;
