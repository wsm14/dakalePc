import React from 'react';
import { Form, Button, Input, InputNumber } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
const ConditionsForm = (props) => {
  const { form } = props;
  return (
    <Form.List name="evokeParamObjectList">
      {(fields, { add, remove }, { errors }) => (
        <>
          <div style={{ height: 30 }}></div>
          {fields.map((field, index) => (
            <Form.Item key={field.key}>
              <span style={{ marginRight: 10 }}>条件{index + 1}: 看视频领卡豆数</span>
              <Form.Item
                {...field}
                validateTrigger={['onChange', 'onBlur']}
                name={[field.name, 'bean']}
                rules={[
                  {
                    required: true,
                    message: '请输入卡豆数',
                  },
                ]}
                noStyle
              >
                <InputNumber precision={0} placeholder="请输入卡豆数" style={{ width: '60%' }} />
              </Form.Item>
                <MinusCircleOutlined
                  className="dynamic-delete-button"
                  onClick={() => remove(field.name)}
                />
            </Form.Item>
          ))}
          {fields.length <= 4 && (
            <Form.Item style={{ textAlign: 'center' }}>
              <Button
                type="dashed"
                onClick={() => add()}
                style={{ width: '60%' }}
                icon={<PlusOutlined />}
              ></Button>
              <Form.ErrorList errors={errors} />
            </Form.Item>
          )}
        </>
      )}
    </Form.List>
  );
};
export default ConditionsForm;
