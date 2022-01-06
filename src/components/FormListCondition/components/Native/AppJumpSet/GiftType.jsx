import React, { useEffect } from 'react';
import { connect } from 'umi';
import { Form } from 'antd';
import { Select } from '@/components/FormCondition/formModule';

const FormItem = Form.Item;

/**
 * 话费抵扣券包 / 平台通用券包 / 电商品券包
 * @param {Array} paramKey app跳转参数键值
 */
const GiftType = ({ paramKey, dispatch, giftTypeList }) => {
  useEffect(() => {
    dispatch({
      type: 'spreeManage/fetchListGiftType',
    });
  }, []);
  return (
    <FormItem
      key={`giftType`}
      label="礼包类型"
      name={['param', paramKey[0]]}
      rules={[{ required: true, message: `请选择礼包类型` }]}
      style={{ maxWidth: '100%' }}
    >
      <Select
        select={giftTypeList}
        fieldNames={{
          label: 'typeName',
          value: 'type',
          //   value: 'giftTypeId',
        }}
        placeholder={'请选择礼包类型'}
      ></Select>
    </FormItem>
  );
};

export default connect(({ spreeManage }) => ({
  giftTypeList: spreeManage.giftTypeList,
}))(GiftType);
