import React, { useState } from 'react';
import { Form } from 'antd';
import Merchant from '../Merchant';
import ShareCoupon from './components/index';

const FormItem = Form.Item;

/**
 * 选择特惠商品
 * @param {Array} paramKey app跳转参数键值
 */
const SpecialGoods = ({ form, paramKey }) => {
  const [data, setData] = useState({}); // 数据

  return (
    <>
      <Merchant form={form} paramKey={paramKey}></Merchant>
      <FormItem
        label="特惠商品"
        name={['param', paramKey[1]]}
        key={'goodsKey'}
        rules={[{ required: true, message: `请选择特惠商品` }]}
        style={{ maxWidth: '100%' }}
      >
        <ShareCoupon
          type="goods"
          show="active"
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

export default SpecialGoods;
