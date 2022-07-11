import React, { useState } from 'react';
import { Form, Button } from 'antd';
import { commerceDom } from '@/components/VideoSelectBindContent/CouponFreeDom';
import BuyContactModal from './BuyContactModal';
import GoodsSelectModal from './GoodsSelectModal';
import FormList from './FormList';
import './coupon.less';

const ShareCoupon = (props) => {
  const { data, type, onDel, onOk, form } = props;

  const [visibleContact, setVisibleContact] = useState(false); // 奖品权益商品选择
  const [visible, setVisible] = useState(false); // 特惠和权益商品多选

  const {
    // 商品
    goodsName,
  } = data || {};

  // 券
  return (
    <>
      {type === 'goodsRight' && goodsName ? (
        commerceDom(data, '', '', onDel)
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
        <Form.List name={type}>
          {(fields, { remove, move }, { errors }) => {
            return (
              <>
                {fields.map((field) => (
                  <FormList
                    type={type}
                    key={field.key}
                    form={form}
                    fields={fields}
                    field={field}
                    remove={remove}
                    move={move}
                  ></FormList>
                ))}
                <Form.ErrorList errors={errors} />
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
        //  特惠商品、权益商品
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
