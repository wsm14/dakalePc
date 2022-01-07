import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Form } from 'antd';
import Merchant from '../Merchant';
import ShareCoupon from './components/index';
import { Radio } from '@/components/FormCondition/formModule';

const FormItem = Form.Item;

/**
 * 选择券
 * @param {Array} paramKey app跳转参数键值
 */
const Coupon = ({ form, dispatch, paramKey }) => {
  const [data, setData] = useState({}); // 数据
  const [owType, setOwType] = useState(''); // 店铺类型

  useEffect(() => {
    setOwType(form.getFieldValue(['param', paramKey[2]]));
    const ownerCouponId = form.getFieldValue(['param', paramKey[1]]);
    if (ownerCouponId) fetchCouponDetail();
    return () => {
      form.setFieldsValue({ param: { [paramKey[1]]: undefined } });
    };
  }, [paramKey]);

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
      <FormItem
        label="店铺类型"
        name={['param', paramKey[2]]}
        key={'ownerTypeStr'}
        rules={[{ required: true, message: `请选择店铺类型` }]}
        style={{ maxWidth: '100%' }}
      >
        <Radio
          select={{
            merchant: '单店',
            group: '集团',
          }}
          onChange={(e) => {
            setOwType(e.target.value);
          }}
        ></Radio>
      </FormItem>
      <Merchant
        form={form}
        paramKey={paramKey}
        owType={owType}
        onChange={(val) => {
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

export default connect()(Coupon);
