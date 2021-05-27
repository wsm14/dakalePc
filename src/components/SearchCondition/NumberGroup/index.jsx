import React, { useState } from 'react';
import { InputNumber, Input, Form } from 'antd';

/**
 * 数字输入组
 */

const NumberGroup = (props) => {
  const { name, label } = props;
  const [minNumber, setMinNumber] = useState(0);
  // 返回结果
  return (
    <Input.Group compact>
      <div style={{ display: 'flex' }}>
        <Form.Item name={[name, 0]} noStyle>
          <InputNumber
            style={{ textAlign: 'center', flex: 1 }}
            min={0}
            placeholder={`最低${label}`}
            onChange={setMinNumber}
          />
        </Form.Item>
        <Input
          style={{
            width: 31,
            borderLeft: 0,
            borderRight: 0,
            pointerEvents: 'none',
          }}
          placeholder="~"
          disabled
        />
        <Form.Item name={[name, 1]} noStyle>
          <InputNumber
            style={{ textAlign: 'center', flex: 1 }}
            min={minNumber}
            placeholder={`最高${label}`}
          />
        </Form.Item>
      </div>
    </Input.Group>
  );
};

export default NumberGroup;
