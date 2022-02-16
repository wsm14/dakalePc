import React from 'react';
import { Form, Input, Button } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
const { TextArea } = Input;

const WithdrawFormList = (props) => {
  const { form } = props;

  return (
    <>
      <Form.List name="contentList">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field, index) => (
              <div key={field.key} style={{ display: 'flex' }}>
                <Form.Item {...field} rules={[{ required: true }]} style={{ width: 400 }}>
                  <TextArea
                    autoSize
                    disabled={
                      (form.getFieldValue('monthIsFree') ? index <= 3 : index <= 2) ? true : false
                    }
                  />
                </Form.Item>
                {(form.getFieldValue('monthIsFree') ? index > 3 : index > 2) ? (
                  <MinusCircleOutlined
                    style={{ fontSize: 20, marginLeft: 10, marginTop: 5 }}
                    onClick={() => remove(field.name)}
                  />
                ) : null}
              </div>
            ))}
            <Button
              type="dashed"
              onClick={() => add()}
              block
              icon={<PlusOutlined />}
              style={{
                width: 250,
                marginBottom: 20,
              }}
            ></Button>
          </>
        )}
      </Form.List>
    </>
  );
};
export default WithdrawFormList;
