import React, { useState } from 'react';
import update from 'immutability-helper';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Form, Input, Button, Row, Col } from 'antd';

const { TextArea } = Input;

const MarkAwardSet = ({ name, form }) => {
  const [textArr, setTextArr] = useState([]);

  // const totalStyle = { textAlign: 'right', paddingRight: 44, marginBottom: 10, marginTop: -16 };

  const total = textArr.reduce((n, p) => n + p, 0);

  return (
    <div style={{ marginBottom: 24 }}>
      <Form.List
        name={name}
        // rules={[
        //   {
        //     validator: () => {
        //       if (total > 1000) {
        //         return Promise.reject(new Error('介绍长度文案不能超过1000字'));
        //       }
        //       return Promise.resolve();
        //     },
        //   },
        // ]}
      >
        {(fields, { add, remove }, { errors }) => (
          <>
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                style={{ width: '60%', marginLeft: 150 }}
                icon={<PlusOutlined />}
              >
                添加
              </Button>
            </Form.Item>
            {fields.map((field, index) => (
              <Form.Item key={field.key}>
                <Form.Item
                  label={`每次打卡领取卡豆数池${index + 1}`}
                  {...field}
                  // validateTrigger={['onChange', 'onBlur']}
                >
                  <Input.Group size="small">
                    <Row gutter={8}>
                      <Col span={5}>
                        <Input></Input>
                      </Col>
                      <Col span={1}>至</Col>
                      <Col span={8}>
                        <Input addonAfter={'卡豆'}></Input>
                      </Col>
                      <Col span={2}>概率</Col>
                      <Col span={6}>
                        <Input addonAfter={'%'}></Input>
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
                  </Input.Group>
                </Form.Item>
              </Form.Item>
            ))}
            <Form.ErrorList errors={errors} />
            {/* {fields.length > 0 && <div style={totalStyle}>{total}/200</div>} */}
          </>
        )}
      </Form.List>
    </div>
  );
};

export default MarkAwardSet;
