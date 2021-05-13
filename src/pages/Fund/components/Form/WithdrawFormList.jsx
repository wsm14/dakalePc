import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Button } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
const { TextArea } = Input;

const WithdrawFormList = (props) => {
  const { form, setContentList } = props;
  const list = [];
  const isShow = form.getFieldValue('monthIsFree');

  const handleadd = (add) => {
    const contentList = form.getFieldValue('contentList');
    list.push('');
    setContentList([...contentList, ...list]);
  };

  const handleRemove = (romove, index) => {
    const contentList = form.getFieldValue('contentList');
    contentList.splice(index, 1);
    console.log(index, contentList);
    setContentList(contentList);
    romove();
  };

  return (
    <>
      <Form.List name="contentList">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field, index) => (
              <div key={field.key} style={{ display: 'flex' }}>
                <Form.Item {...field} rules={[{ required: true }]} style={{ width: 400 }}>
                  <TextArea autoSize disabled={(isShow ? index <= 3 : index <= 2) ? true : false} />
                </Form.Item>
                {(isShow ? index > 3 : index > 2) ? (
                  <MinusCircleOutlined
                    style={{ fontSize: 20, marginLeft: 10, marginTop: 5 }}
                    onClick={() => handleRemove(() => remove(field.name), index)}
                  />
                ) : null}
              </div>
            ))}
            <Button
              type="dashed"
              onClick={() => handleadd(() => add())}
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
