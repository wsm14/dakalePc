import React, { useState, useEffect } from 'react';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Form, Input, Button, Row, Col, InputNumber } from 'antd';

const MarkAwardSet = ({ name }) => {
  const [textArr, setTextArr] = useState([]);

  return (
    <div style={{ marginBottom: 24 }}>
      <Form.List
        name={name}
        rules={[
          {
            validator: async (_, names) => {
              if (!names) {
                return Promise.reject(new Error('请添加卡豆池'));
              }
              const sum = names.reduce(
                (preValue, curValue) => preValue + Number(curValue?.countRate || 0),
                0,
              );
              if (sum !== 100) {
                return Promise.reject(new Error('各卡豆池概率相加不等于100%，请修改'));
              }
            },
          },
        ]}
      >
        {(fields, { add, remove }, { errors }) => (
          <>
            <Form.Item label={'添加卡豆奖池'} required>
              <Button
                type="dashed"
                onClick={() => add()}
                style={{ width: '60%' }}
                icon={<PlusOutlined />}
              >
                添加
              </Button>
            </Form.Item>
            <div style={{ marginLeft: 200 }}>
              <Form.ErrorList errors={errors} />
            </div>
            {fields.map((field, name) => (
              <React.Fragment key={field.key}>
                <Form.Item required label={`每次打卡领取卡豆数池${name + 1}`}>
                  <Input.Group size="small" compact>
                    <Form.Item
                      rules={[{ required: true, message: '请输入卡豆数' }]}
                      name={[name, 'minBean']}
                      noStyle
                    >
                      <InputNumber
                        min={0}
                        precision={0}
                        style={{ width: 100 }}
                        placeholder="请输入卡豆数"
                      ></InputNumber>
                    </Form.Item>
                    <div style={{ margin: '0 10px', lineHeight: '32px' }}>至</div>
                    <Form.Item
                      rules={[{ required: true, message: '请输入卡豆数' }]}
                      name={[name, 'maxBean']}
                      noStyle
                    >
                      <InputNumber
                        min={0}
                        precision={0}
                        style={{ width: 160 }}
                        placeholder="请输入卡豆数"
                        addonAfter={'卡豆'}
                      ></InputNumber>
                    </Form.Item>
                    <div style={{ marginLeft: 10, marginRight: 3, lineHeight: '32px' }}>概率</div>
                    <Form.Item
                      rules={[{ required: true, message: '请输入概率' }]}
                      name={[name, 'countRate']}
                      noStyle
                    >
                      <InputNumber
                        min={0.1}
                        max={100}
                        precision={1}
                        style={{ width: 140 }}
                        placeholder="请输入比例"
                        addonAfter={'%'}
                      ></InputNumber>
                    </Form.Item>
                    {fields.length > 1 ? (
                      <MinusCircleOutlined
                        style={{ fontSize: 20, marginLeft: 15, lineHeight: '32px' }}
                        onClick={() => {
                          setTextArr(textArr.filter((ci, i) => i !== index));
                          remove(field.name);
                        }}
                      />
                    ) : null}
                  </Input.Group>
                </Form.Item>
              </React.Fragment>
            ))}
          </>
        )}
      </Form.List>
    </div>
  );
};

export default MarkAwardSet;
