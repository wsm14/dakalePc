import React, { useState } from 'react';
import { Form, Button } from 'antd';
import { platformCouponsDom } from './CouponFreeDom';
import GoodsSelectModal from '@/components/GoodsSelectModal';
import FormList from './FormList';

const ShareCoupon = (props) => {
  const { type = '', form, data = [], handleType } = props;

  const giftType = Form.useWatch('giftTypeId', form) || '';
  const [visible, setVisible] = useState(false); // 平台券、权益商品和权益券多选

  // 券
  return (
    <>
      {data.length !== 0 ? (
        data.map((item) => platformCouponsDom(item, item?.platformCouponId))
      ) : (
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
          {(fields, { remove, move }, { errors }) => {
            // console.log(fields);
            return (
              <>
                <Form.ErrorList errors={errors} />
                {handleType !== 'edit' && (
                  <Form.Item>
                    <Button type="link" onClick={() => setVisible(true)}>
                      {'+ 新增'}
                    </Button>
                  </Form.Item>
                )}

                {fields.map((field, i) => (
                  <FormList
                    type={type}
                    handleType={handleType}
                    key={field.key}
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
      )}
      {/* 平台券、权益商品、权益券 */}
      <GoodsSelectModal
        showTag={['platformCoupon']}
        visible={visible}
        searchParams={giftType === '1542066982778494977' ? { useScenesType: 'community' } : {}}
        onSumbit={({ list }) =>
          form.setFieldsValue({
            [type]: (form.getFieldValue(type) || []).concat(list),
          })
        }
        onClose={() => setVisible(false)}
      ></GoodsSelectModal>
    </>
  );
};

export default ShareCoupon;
