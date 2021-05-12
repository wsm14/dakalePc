import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Button } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const WithdrawFormList = (props) => {
  const { form } = props;

  return (
    <>
      <Form.List name="names">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ fieldKey, name, key, ...restField }, index) => (
              <div
                key={fieldKey + name}
                style={{ border: '1px solid #cccccc', padding: '24px 0 0', marginBottom: 10 }}
              >
                <Form.Item {...restField} label="提现金额" style={{ marginBottom: '0' }} rules={[{ required: true,message:'请输入提现金额' }]}>
                  <Input.Group compact>
                    {fields.length !== index + 1 && (
                      <>
                        <Form.Item
                          name={[name, 'Firstmoney']}
                          fieldKey={[fieldKey, 'Firstmoney']}
                          rules={[{ required: true,message:'请输入提现金额' }]}
                          style={{ width: 150 }}
                        >
                          <Input suffix="元" style={{ width: 150 }} />
                        </Form.Item>
                        <Input
                          placeholder="-"
                          style={{ width: 30, pointerEvents: 'none' }}
                          disabled
                        />
                      </>
                    )}
                    <Form.Item
                      name={[name, 'money']}
                      fieldKey={[fieldKey, 'money']}
                      rules={[{ required: true,message:'请输入提现金额' }]}
                      style={{ width: 150 }}
                    >
                      <Input
                        suffix={fields.length == index + 1 ? '元以上' : '元'}
                        style={{ width: fields.length == index + 1 ?300:150 }}
                      />
                    </Form.Item>
                    {fields.length > 2 ? (
                      <MinusCircleOutlined
                        style={{ fontSize: 20, marginLeft: 10, marginTop: 5 }}
                        onClick={() => remove(name)}
                      />
                    ) : null}
                  </Input.Group>
                </Form.Item>
                <Form.Item
                  {...restField}
                  label="提现手续费"
                  name={[name, 'name']}
                  fieldKey={[fieldKey, 'name']}
                  rules={[{ required: true }]}
                >
                  <Input suffix="元" style={{ width: 150 }} />
                </Form.Item>
              </div>
            ))}
            <Button
              type="dashed"
              onClick={() => add()}
              block
              icon={<PlusOutlined />}
              style={{
                width: 250,
                display: 'block',
                margin: '0 auto',
                marginBottom: 20,
              }}
            >
              新增层级
            </Button>
          </>
        )}
      </Form.List>
    </>
  );
};
export default WithdrawFormList;
