import React, { useState } from 'react';
import { Form, Button } from 'antd';
import GoodsSelectModal from '@/components/GoodsSelectModal';
import FormList from './FormList';

const ShareCoupon = (props) => {
  const { type = '', dataType = '', form, showTag } = props;

  const [visible, setVisible] = useState(false); // 平台券、权益商品和权益券多选

  // 券
  return (
    <>
      <Form.List
        name={type || dataType}
        rules={[
          {
            validator: async (types, names) => {
              // console.log(a, names);
              if (!names || names.length < 1) {
                return Promise.reject(new Error('请至少选择1个商品'));
              }
            },
          },
        ]}
      >
        {(fields, { remove, move }, { errors }) => {
          // console.log(fields);
          return (
            <>
              <Form.ErrorList errors={errors} />
              <Form.Item>
                <Button onClick={() => setVisible(true)}>{'+ 选择商品'}</Button>
              </Form.Item>
              {fields.map((field, i) => (
                <FormList
                  type={type || dataType}
                  key={field.fieldKey}
                  form={form}
                  fields={fields}
                  field={field}
                  remove={remove}
                  move={move}
                ></FormList>
              ))}
            </>
          );
        }}
      </Form.List>
      {/* 特惠商品，电商品，自我游 */}
      <GoodsSelectModal
        showTag={showTag}
        goodsValues={form.getFieldValue(type || dataType) || []}
        visible={visible}
        onSumbit={({ list }) => {
          form.setFieldsValue({ [type || dataType]: list });
        }}
        onClose={() => setVisible(false)}
      ></GoodsSelectModal>
    </>
  );
};

export default ShareCoupon;
