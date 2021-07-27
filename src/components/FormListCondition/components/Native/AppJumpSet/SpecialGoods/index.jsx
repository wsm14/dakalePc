import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Form } from 'antd';
import Merchant from '../Merchant';
import ShareCoupon from './components/index';

const FormItem = Form.Item;

/**
 * 选择特惠商品
 * @param {Array} paramKey app跳转参数键值
 */
const SpecialGoods = ({ form, dispatch, paramKey }) => {
  const [data, setData] = useState({}); // 数据

  useEffect(() => {
    const specialGoodsId = form.getFieldValue(['param', paramKey[1]]);
    if (specialGoodsId) fetchSpecialGoodsDetail();
    return () => {
      form.setFieldsValue({ param: { [paramKey[1]]: undefined } });
    };
  }, []);

  // 获取详情
  const fetchSpecialGoodsDetail = () => {
    const ownerId = form.getFieldValue(['param', paramKey[0]]);
    const specialGoodsId = form.getFieldValue(['param', paramKey[1]]);
    dispatch({
      type: 'specialGoods/fetchSpecialGoodsDetail',
      payload: { specialGoodsId, ownerId },
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
        onChange={() => {
          form.setFieldsValue({ param: { [paramKey[1]]: undefined } });
          setData({});
        }}
      ></Merchant>
      <FormItem
        label="特惠商品"
        name={['param', paramKey[1]]}
        key={'goodsKey'}
        rules={[{ required: true, message: `请选择特惠商品` }]}
        style={{ maxWidth: '100%' }}
      >
        <ShareCoupon
          data={data}
          form={form}
          merchantIdKey={paramKey[0]}
          onOk={(free) => {
            console.log(free);
            form.setFieldsValue({ param: { [paramKey[1]]: free.specialGoodsId } });
            setData(free);
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

export default connect()(SpecialGoods);
