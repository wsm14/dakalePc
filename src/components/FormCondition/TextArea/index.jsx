import React, { useState } from 'react';
import { Input } from 'antd';
import { delectProps } from '../utils';

const TextAreaBlock = (props) => {
  const { initialvalues = {}, rows, name, maxLength, onChange } = props;

  const [totalNum, setTotalNum] = useState(0); // 字数计算
  const divProps = delectProps(props);

  const numtext = () => {
    if (!maxLength) return 0;
    if (Array.isArray(name)) {
      return initialvalues[name[0]] ? initialvalues[name[0]][name[1]] || 0 : '';
    } else {
      return initialvalues[name] ? initialvalues[name] : '';
    }
  };

  const dataNum = maxLength && `${totalNum || (numtext() && `${numtext()}`.length)}/${maxLength}`;
  console.log(divProps);
  return (
    <>
      <Input.TextArea
        {...divProps}
        onChange={(e) => {
          onChange(e);
          setTotalNum(e.target.value.length);
        }}
        rows={rows || 5}
      />
      {maxLength && (
        <div style={{ display: 'flex' }}>
          <div style={{ flex: 1 }}></div>
          {dataNum}
        </div>
      )}
    </>
  );
};

export default TextAreaBlock;
