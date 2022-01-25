import React, { useState } from 'react';
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
            validator: async (rule, names) => {
              console.log('11', rule, names);
              const isOk = names.every((item) => Object.keys(item).length === 3);
              if (isOk) {
                console.log(1111);
                return Promise.reject(new Error('请至少选择1个商品'));
              }
            },
          },
        ]}
      >
        {(fields, { add, remove }, { errors }) => (
          <>
            <Form.Item label={'添加卡豆奖池'}>
              <Button
                type="dashed"
                onClick={() => add()}
                style={{ width: '60%' }}
                icon={<PlusOutlined />}
              >
                添加
              </Button>
            </Form.Item>
            <Form.ErrorList errors={errors} />
            {fields.map((field, name) => (
              <React.Fragment key={field.key}>
                {console.log('field', field)}
                <Input.Group size="small">
                  <Form.Item
                    label={`每次打卡领取卡豆数池${name + 1}`}
                    // {...field}
                    // validateTrigger={['onChange', 'onBlur']}
                  >
                    <Row gutter={8}>
                      <Col span={5}>
                        <Form.Item
                          rules={[{ required: true, message: '请输入卡豆数' }]}
                          name={[name, 'minBean']}
                          noStyle
                        >
                          <InputNumber placeholder="请输入卡豆数"></InputNumber>
                        </Form.Item>
                      </Col>
                      <Col span={1}>至</Col>
                      <Col span={8}>
                        <Form.Item
                          rules={[{ required: true, message: '请输入卡豆数' }]}
                          name={[name, 'maxBean']}
                          noStyle
                        >
                          <InputNumber placeholder="请输入卡豆数" addonAfter={'卡豆'}></InputNumber>
                        </Form.Item>
                      </Col>
                      <Col span={2}>概率</Col>
                      <Col span={6}>
                        <Form.Item
                          rules={[{ required: true, message: '请输入概率' }]}
                          name={[name, 'countRate']}
                          noStyle
                        >
                          <InputNumber placeholder="请输入比例" addonAfter={'%'}></InputNumber>
                        </Form.Item>
                      </Col>
                      <Col span={2}>
                        {fields.length > 1 ? (
                          <MinusCircleOutlined
                            style={{ fontSize: 20, marginLeft: 5 }}
                            onClick={() => {
                              setTextArr(textArr.filter((ci, i) => i !== index));
                              remove(field.name);
                            }}
                          />
                        ) : null}
                      </Col>
                    </Row>
                  </Form.Item>
                </Input.Group>
              </React.Fragment>
            ))}
          </>
        )}
      </Form.List>
    </div>
  );
};

export default MarkAwardSet;
