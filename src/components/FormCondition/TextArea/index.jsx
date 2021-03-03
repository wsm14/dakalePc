import React, { useState } from 'react';
import { Input } from 'antd';
import { delectProps } from '../utils';

const TextAreaBlock = (props) => {
  const { form, initialvalues = {}, rows, name, maxLength, onChange } = props;

  const [totalNum, setTotalNum] = useState(0); // 字数计算
  const divProps = delectProps(props);

  const numtext = () => {
    if (!maxLength) return 0;
    if (Array.isArray(name)) {
      return initialvalues[name[0]] ? initialvalues[name[0]][name[1]] || 0 : '';
    } else {
      const inputData = form.getFieldValue(name);
      return inputData ? inputData : 0;
    }
  };

  const dataNum = maxLength && `${totalNum || (numtext() && `${numtext()}`.length)}/${maxLength}`;

  return (
    <>
      <Input.TextArea
        {...divProps}
        rows={rows || 5}
        onChange={(e) => {
          onChange && onChange(e);
          setTotalNum(e.target.value.length);
        }}
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
