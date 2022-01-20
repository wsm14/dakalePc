import React, { useState } from 'react';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Form, Input, Button, Row, Col } from 'antd';

const MarkAwardSet = ({ name }) => {
  const [textArr, setTextArr] = useState([]);

  return (
    <div style={{ marginBottom: 24 }}>
      <Form.List name={name}>
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
            {fields.map((field, index) => (
              <React.Fragment key={field.key}>
                <Input.Group size="small">
                  <Form.Item
                    label={`每次打卡领取卡豆数池${index + 1}`}
                    // {...field}
                    // validateTrigger={['onChange', 'onBlur']}
                  >
                    <Row gutter={8}>
                      <Col span={5}>
                        <Form.Item name={[name, 'minBean']} noStyle>
                          <Input></Input>
                        </Form.Item>
                      </Col>
                      <Col span={1}>至</Col>
                      <Col span={8}>
                        <Form.Item name={[name, 'maxBean']} noStyle>
                          <Input addonAfter={'卡豆'}></Input>
                        </Form.Item>
                      </Col>
                      <Col span={2}>概率</Col>
                      <Col span={6}>
                        <Form.Item name={[name, 'countRate']} noStyle>
                          <Input addonAfter={'%'}></Input>
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
            <Form.ErrorList errors={errors} />
          </>
        )}
      </Form.List>
    </div>
  );
};

export default MarkAwardSet;
