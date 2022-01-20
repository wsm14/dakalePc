import React, { useState } from 'react';
// import { notification } from 'antd';
import { Form, Button } from 'antd';
import { platformCouponsDom, couponsDom, goodsDom } from './CouponFreeDom';
import GoodsSelectModal from './GoodsSelectModal';
import FormList from './FormList';

import './coupon.less';

const ShareCoupon = (props) => {
  const { type = '', form, data = [], handleType } = props;

  const [visible, setVisible] = useState(false); // 平台券、权益商品和权益券多选

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
      )}
      {
        //  平台券、权益商品、权益券
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
