import React, { useState } from 'react';
import { Form, TreeSelect, Button, Cascader } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
const TradeCategorySelect = (props) => {
  const { form, list = [], checkType } = props;
  const displayRender = (labels) => labels[labels.length - 1];
  return (
    <Form.List
      name="classifyIdList"
      rules={[
        {
          validator: async (_, names) => {
            if (checkType === 'behind' && (!names || !names[0])) {
              return Promise.reject(new Error('请填写关联后台项目'));
            }
          },
        },
      ]}
    >
      {(fields, { add, remove }, { errors }) => (
        <>
          {fields.map((field, index) => (
            <Form.Item
              // {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
              //   label={index === 0 ? `关联行业类目${index + 1}` : ''}
              required={false}
              key={field.key}
            >
              <Form.Item
                {...field}
                name={[field.name]}
                validateTrigger={['onChange', 'onBlur']}
                rules={[
                  {
                    required: false,
                    message: '请选择类目',
                  },
                ]}
                noStyle
              >
                <TreeSelect
                  treeData={list}
                  style={{ width: 200 }}
                  showSearch
                  placeholder="请选择类目"
                  allowClear
                ></TreeSelect>
                {/* <Cascader
                  options={list}
                  placeholder="请选择类目"
                  fieldNames={{ label: 'classifyName', value: 'classifyId', children: 'childList' }}
                  displayRender={displayRender}
                /> */}
              </Form.Item>
              {fields.length > 1 && index !== 0 ? (
                <MinusCircleOutlined
                  className="dynamic-delete-button"
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
            ></Button>
            <Form.ErrorList errors={errors} />
          </Form.Item>
        </>
      )}
    </Form.List>
  );
};
export default TradeCategorySelect;
