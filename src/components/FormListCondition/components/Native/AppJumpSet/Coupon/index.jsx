import React, { useState, useEffect } from 'react';
import { Form } from 'antd';
import Merchant from '../Merchant';
import ShareCoupon from './components/index';

const FormItem = Form.Item;

/**
 * 选择券
 * @param {Array} paramKey app跳转参数键值
 */
const Coupon = ({ form, paramKey }) => {
  const [data, setData] = useState({}); // 数据

  useEffect(() => {
    return () => {
      form.setFieldsValue({ param: { [paramKey[1]]: undefined } });
    };
  }, []);

  return (
    <>
      <Merchant
        form={form}
        paramKey={paramKey}
        onChange={() => {
          form.setFieldsValue({ param: { [paramKey[1]]: undefined } });
          setData({});
        }}
      ></Merchant>
      <FormItem
        label="优惠券"
        name={['param', paramKey[1]]}
        key={'goodsKey'}
        rules={[{ required: true, message: `请选择优惠券` }]}
        style={{ maxWidth: '100%' }}
      >
        <ShareCoupon
          data={data}
          form={form}
          merchantIdKey={paramKey[0]}
          onOk={(res) => {
            console.log(res);
            form.setFieldsValue({ param: { [paramKey[1]]: res.ownerCouponIdString } });
            setData(res);
          }}
          onDel={() => {
            form.setFieldsValue({ param: { [paramKey[1]]: undefined } });
            setData({});
          }}
        ></ShareCoupon>
      </FormItem>
    </>
  );
};

export default Coupon;
