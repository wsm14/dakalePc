import React from 'react';
import { connect } from 'umi';
import { Form } from 'antd';
import Merchant from './Merchant';

const FormItem = Form.Item;

/**
 * 选择特惠商品
 * @param {Array} paramKey app跳转参数键值
 */
const SpecialGoods = ({ form, paramKey, dispatch }) => {
  return (
    <>
      <Merchant paramKey={paramKey}></Merchant>
    </>
  );
};

export default connect(({ baseData, loading }) => ({
  selectList: baseData.groupMreList,
  loading: loading.effects['baseData/fetchGetGroupMreList'],
}))(SpecialGoods);
