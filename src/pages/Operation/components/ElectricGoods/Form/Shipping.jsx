import React, { useState, useEffect } from 'react';
import { Radio, InputNumber } from 'antd';

// 发货规则
const Shipping = ({ value = '', onChange }) => {
  const [a, setRadio] = useState('24小时内发货');
  const [b, setNum] = useState('');

  useEffect(() => {
    if (value && !['24小时内发货', '72小时内发货'].includes(value)) {
      const num = value.replace('天内发货', '');
      setNum(Number(num));
    }
  }, []);

  const triggerChange = (changedValue) => {
    onChange?.(changedValue);
  };

  const onRadioChange = (e) => {
    const newNumber = e.target.value;
    setRadio(newNumber);
    triggerChange(newNumber);
  };

  const onNumChange = (val) => {
    setNum(val);
    setRadio(`${val}天内发货`);
    triggerChange(`${val}天内发货`);
  };

  return (
    <span>
      <Radio.Group value={value || a} onChange={onRadioChange}>
        <Radio value="24小时内发货">24小时内发货</Radio>
        <Radio value="72小时内发货">72小时内发货</Radio>
        <Radio value={`${b}天内发货`}>
          <InputNumber
            value={b}
            onChange={onNumChange}
            precision={0}
            style={{
              width: 70,
            }}
          />
          天内发货
        </Radio>
      </Radio.Group>
    </span>
  );
};

export default Shipping;
