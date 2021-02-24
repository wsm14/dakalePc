import React, { useState } from 'react';
import { Input } from 'antd';
import { delectProps } from '../utils';

const InputBlock = (props) => {
  const { initialvalues = {}, suffix, name, onChange = undefined, maxLength, addonAfter } = props;

  const divProps = delectProps(props);
  const [totalNum, setTotalNum] = useState(0); // 字数计算

  const numtext = () => {
    if (!maxLength) return 0;
    if (Array.isArray(name)) {
      return initialvalues[name[0]] ? initialvalues[name[0]][name[1]] || 0 : '';
    } else {
      return initialvalues[name] ? initialvalues[name] : '';
    }
  };

  const dataNum = maxLength && `${totalNum || (numtext() && `${numtext()}`.length)}/${maxLength}`;

  return (
    <Input
      {...divProps}
      addonAfter={addonAfter}
      suffix={dataNum || suffix || ''}
      onChange={(e) => {
        if (onChange) onChange(e);
        setTotalNum(e.target.value.length);
      }}
    />
  );
};

export default InputBlock;
