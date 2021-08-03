import React from 'react';
import { Form, Input, Button, Space, DatePicker } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
const { RangePicker } = DatePicker;
const RateFormList = (props) => {
  const { name = 'scanObj' } = props;
  return (
    <Form.List name={name}>
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name, fieldKey, ...restField }) => (
            <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
              <Form.Item
                {...restField}
                name={[name, 'time']}
                fieldKey={[fieldKey, 'time']}
                rules={[{ required: true, message: '请选择时间范围' }]}
              >
                <RangePicker />
              </Form.Item>
              <Form.Item
                {...restField}
                name={[name, 'rate']}
                fieldKey={[fieldKey, 'rate']}
                rules={[{ required: true, message: '请输入费率' }]}
              >
                <Input placeholder="请输入费率" suffix="%" />
              </Form.Item>
              <MinusCircleOutlined onClick={() => remove(name)} />
            </Space>
          ))}
          <Form.Item>
            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
              新增
            </Button>
          </Form.Item>
        </>
      )}
    </Form.List>
  );
};
export default RateFormList;
