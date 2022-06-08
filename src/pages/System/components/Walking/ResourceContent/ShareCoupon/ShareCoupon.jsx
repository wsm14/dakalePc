import React, { useState } from 'react';
import { Form, Button } from 'antd';
import GoodsSelectModal from '@/components/GoodsSelectModal';
import FormList from './FormList';

const ShareCoupon = (props) => {
  const { type = '', form, data = [] } = props;

  const [visible, setVisible] = useState(false); // 平台券、权益商品和权益券多选

  // 券
  return (
    <>
      <Form.List
        name={type}
        rules={[
          {
            validator: async (type, names) => {
              // console.log(a, names);
              if (type.field === 'specialGoods' && (!names || names.length < 1)) {
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
                  type={type}
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
        showTag={[type]}
        visible={visible}
        onSumbit={({ list }) => {
          form.setFieldsValue({ [type]: list });
        }}
        onClose={() => setVisible(false)}
      ></GoodsSelectModal>
    </>
  );
};

export default ShareCoupon;
