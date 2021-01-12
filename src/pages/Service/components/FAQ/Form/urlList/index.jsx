import React from 'react';
import { Form, Input } from 'antd';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';

const formList = () => {
  return (
    <Form.List name="packageGoodsObjects">
      {(fields, { add, remove }) => {
        return (
          <div style={{ paddingLeft: 43 }}>
            <div style={{ marginBottom: 10, display: 'flex' }}>
              超链接：
              <PlusCircleOutlined onClick={() => add()} style={{ fontSize: 22, margin: '0 10px' }} />
            </div>
            {fields.map((field) => (
              <div style={{ display: 'flex' }}>
                <Form.Item
                  style={{ flex: 0.5, marginRight: 5 }}
                  name={[field.name, 'linkName']}
                  fieldKey={[field.fieldKey, 'linkName']}
                  wrapperCol={24}
                >
                  <Input placeholder="输入名称" maxLength={4} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                  style={{ flex: 1 }}
                  name={[field.name, 'linkUrl']}
                  fieldKey={[field.fieldKey, 'linkUrl']}
                  wrapperCol={24}
                >
                  <Input placeholder="输入合法链接" style={{ width: '100%' }} />
                </Form.Item>
                <MinusCircleOutlined
                  onClick={() => remove(field.name)}
                  style={{ fontSize: 22, marginLeft: 10, paddingTop: 5 }}
                />
              </div>
            ))}
          </div>
        );
      }}
    </Form.List>
  );
};

export default formList;
