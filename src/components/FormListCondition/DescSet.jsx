import React, { useState } from 'react';
import update from 'immutability-helper';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Form, Input, Button } from 'antd';

const { TextArea } = Input;

const GoodsDescSet = ({ name }) => {
  const [textArr, setTextArr] = useState([]);

  // const totalStyle = { textAlign: 'right', paddingRight: 44, marginBottom: 10, marginTop: -16 };

  const total = textArr.reduce((n, p) => n + p, 0);

  return (
    <div style={{ marginBottom: 24 }}>
      <Form.List
        name={name}
        rules={[
          {
            validator: () => {
              if (total > 200) {
                return Promise.reject(new Error('介绍长度文案不能超过200字'));
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        {(fields, { add, remove }, { errors }) => (
          <>
            {fields.map((field, index) => (
              <Form.Item required={false} key={field.key}>
                <Form.Item {...field} validateTrigger={['onChange', 'onBlur']} noStyle>
                  <TextArea
                    autoSize
                    maxLength={200}
                    placeholder="请输入详情"
                    style={{ width: '90%' }}
                    onChange={(e) => {
                      const newText = update(textArr, {
                        $splice: [[index, 1, e.target.value.length]],
                      });
                      setTextArr(newText);
                    }}
                  />
                </Form.Item>
                {fields.length > 1 ? (
                  <MinusCircleOutlined
                    style={{ fontSize: 20, marginLeft: 5 }}
                    onClick={() => {
                      setTextArr(textArr.filter((ci, i) => i !== index));
                      remove(field.name);
                    }}
                  />
                ) : null}
              </Form.Item>
            ))}
            <Form.ErrorList errors={errors} />
            {/* {fields.length > 0 && <div style={totalStyle}>{total}/200</div>} */}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                style={{ width: '60%' }}
                icon={<PlusOutlined />}
              >
                添加
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </div>
  );
};

export default GoodsDescSet;
