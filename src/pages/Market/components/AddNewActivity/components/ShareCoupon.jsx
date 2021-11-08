import React, { useState } from 'react';
// import { notification } from 'antd';
import { Form, Button } from 'antd';
import { couponsDom, goodsDom } from './CouponFreeDom';
import BuyContactModal from './BuyContactModal';
import GoodsSelectModal from './GoodsSelectModal';
import FormList from './FormList';

import './coupon.less';

const ShareCoupon = (props) => {
  const {
    data,
    // merchantIdKey = 'merchantIdStr',
    // show = 'free',
    // ownerType = 'merchant',
    type,
    onDel,
    onOk,
    form,
  } = props;

  const [visibleContact, setVisibleContact] = useState(false); // 奖品权益商品选择
  const [visible, setVisible] = useState(false); // 选择

  const {
    // 券
    couponName,
    buyFlag,
    // 商品
    goodsName,
  } = data || {};

  // 券
  return (
    <>
      {type === 'goodsRight' && goodsName ? (
        goodsDom(data, '', '', onDel)
      ) : type === 'goodsRight' ? (
        <div
          className="share_Coupon share_add"
          onClick={() => {
            setVisibleContact(true);
          }}
        >
          +
        </div>
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
            console.log(fields);
            return (
              <>
                <Form.ErrorList errors={errors} />
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
                <Form.Item>
                  <Button disabled={fields.length === 50} block onClick={() => setVisible(true)}>
                    {fields.length} / {50} 选择商品
                  </Button>
                </Form.Item>
              </>
            );
          }}
        </Form.List>
      )}
      {type === 'goodsRight' ? (
        //  奖品权益商品选择
        <BuyContactModal
          typeGoods={type}
          visible={visibleContact}
          onOk={onOk}
          onClose={() => setVisibleContact(false)}
        ></BuyContactModal>
      ) : (
        //  特惠商品
        <GoodsSelectModal
          typeGoods={type}
          form={form}
          visible={visible}
          onClose={() => setVisible(false)}
        ></GoodsSelectModal>
      )}
    </>
  );
};

export default ShareCoupon;
