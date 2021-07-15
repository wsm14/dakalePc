import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Form } from 'antd';
import Merchant from '../Merchant';
import ShareCoupon from './components/index';

const FormItem = Form.Item;

/**
 * 选择券
 * @param {Array} paramKey app跳转参数键值
 */
const Coupon = ({ form, dispatch, paramKey }) => {
  const [data, setData] = useState({}); // 数据

  useEffect(() => {
    const ownerCouponId = form.getFieldValue(['param', paramKey[1]]);
    if (ownerCouponId) fetchCouponDetail();
    return () => {
      form.setFieldsValue({ param: { [paramKey[1]]: undefined } });
    };
  }, []);

  // 获取详情
  const fetchCouponDetail = () => {
    const ownerId = form.getFieldValue(['param', paramKey[0]]);
    const ownerCouponId = form.getFieldValue(['param', paramKey[1]]);
    dispatch({
      type: 'couponManage/fetchCouponDetail',
      payload: { ownerCouponId, ownerId },
      callback: (val) => {
        setData(val);
      },
    });
  };

  return (
    <>
      <Merchant
        form={form}
        paramKey={paramKey}
        onChange={(val) => {
          form.setFieldsValue({ param: { [paramKey[1]]: undefined, ownerId: val } });
          setData({});
        }}
      ></Merchant>
      <FormItem label="ownerId" name={['param', 'ownerId']} hidden></FormItem>
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

export default connect()(Coupon);
