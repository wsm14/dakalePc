import React from 'react';
import { InputNumber } from 'antd';
import { delectProps } from '../utils';

const InputNumberBlock = (props) => {
  const { suffix, addonAfter, addonBefore, style, ...other } = props;
  const divProps = delectProps(other);
  return (
    <>
      <InputNumber
        style={{ width: suffix ? '75%' : '100%', ...style }}
        addonAfter={addonAfter}
        addonBefore={addonBefore}
        {...divProps}
      />
      {suffix && <span style={{ marginLeft: 10 }}>{suffix}</span>}
    </>
  );
};

export default InputNumberBlock;
