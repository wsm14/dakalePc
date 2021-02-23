import React, { useState } from 'react';
import { Input } from 'antd';

const InputBlock = (props) => {
  const { initialvalues = {}, rows, name, maxLength } = props;

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
    <>
      <Input.TextArea
        rows={rows || 5}
        {...props}
        onChange={(e) => setTotalNum(e.target.value.length)}
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

export default InputBlock;
