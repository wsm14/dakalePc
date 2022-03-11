import React, { useState } from 'react';
import { Form, Button } from 'antd';
import { commerceDom, goodsDom } from './CouponFreeDom';
import FormList from './FormList';
import './coupon.less';

const ShareCoupon = (props) => {
  const { type = '', form } = props;

  return (
    <>
      <Form.List
        name={type}
        rules={[
          {
            validator: async (_, names) => {
              if (!names || names.length < 1) {
                return Promise.reject(new Error('请至少选择1个商品'));
              }
            },
          },
        ]}
      >
        {(fields, { add, remove, move }, { errors }) => {
          // console.log(fields);
          return (
            <>
              {fields.map((field, i) => (
                <FormList
                  name={type}
                  key={field.fieldKey}
                  form={form}
                  fields={fields}
                  field={field}
                  remove={remove}
                  move={move}
                ></FormList>
              ))}
              <Form.Item>
                <Button onClick={() => add()}>{'+ 增加券'}</Button>
              </Form.Item>
              <Form.ErrorList errors={errors} />
            </>
          );
        }}
      </Form.List>
    </>
  );
};

export default ShareCoupon;
