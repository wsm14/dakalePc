import React, { useState } from 'react';
import { Form, Button } from 'antd';
import { platformCouponsDom, couponsDom, goodsDom } from './CouponFreeDom';
import GoodsSelectModal from './GoodsSelectModal';
import FormList from './FormList';
import './coupon.less';

const ShareCoupon = (props) => {
  const { type = '', form, data = [], handleType } = props;
  const [visible, setVisible] = useState(false); // 平台券
  
  // 券
  return (
    <>
      {data.length !== 0 ? (
        data.map((item) => {
          return {
            platformCoupon: platformCouponsDom(item, item?.platformCouponId),
            rightGoods: goodsDom(item, item?.specialGoodsId),
            rightCoupon: couponsDom(item, item?.ownerCouponIdString),
          }[item?.tagType || 'platformCoupon'];
        })
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
          {(fields, { remove }, { errors }) => {
            return (
              <>
                {fields.length == 0 && (
                  <Form.Item>
                    <Button onClick={() => setVisible(true)}>选择券</Button>
                  </Form.Item>
                )}
                {fields.map((field, i) => (
                  <FormList
                    type={type}
                    handleType={handleType}
                    key={field.fieldKey}
                    form={form}
                    fields={fields}
                    field={field}
                    remove={remove}
                  ></FormList>
                ))}
                <Form.ErrorList errors={errors} />
              </>
            );
          }}
        </Form.List>
      )}
      {
        //  平台券
        <GoodsSelectModal
          typeGoods={type}
          form={form}
          visible={visible}
          onClose={() => setVisible(false)}
        ></GoodsSelectModal>
      }
    </>
  );
};

export default ShareCoupon;
