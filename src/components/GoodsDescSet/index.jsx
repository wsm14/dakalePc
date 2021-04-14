import React from 'react';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Form, Input, Button } from 'antd';

const GoodsDescSet = ({ keyName }) => {
  return (
    <div style={{ marginBottom: 24 }}>
      <Form.List name={keyName}>
        {(fields, { add, remove }) => (
          <>
            {fields.map((field) => (
              <Form.Item required={false} key={field.key}>
                <Form.Item {...field} validateTrigger={['onChange', 'onBlur']} noStyle>
                  <Input placeholder="请输入详情" style={{ width: '90%' }} />
                </Form.Item>
                {fields.length > 1 ? (
                  <MinusCircleOutlined
                    style={{ fontSize: 20, marginLeft: 5 }}
                    onClick={() => remove(field.name)}
                  />
                ) : null}
              </Form.Item>
            ))}
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
