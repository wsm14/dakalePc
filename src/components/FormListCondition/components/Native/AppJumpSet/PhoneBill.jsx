import React, { useEffect } from 'react';
import { connect } from 'umi';
import debounce from 'lodash/debounce';
import { Form } from 'antd';
import { Select } from '@/components/FormCondition/formModule';

const FormItem = Form.Item;

/**
 * 话费
 * @param {Array} paramKey app跳转参数键值
 * @param {String} showApi app跳转类型
 */
const PhoneBill = ({ form, paramKey, showApi, virtualList, loading, dispatch }) => {
  useEffect(() => {
    return () => {
      dispatch({ type: 'baseData/clearVirtual' });
      form.setFieldsValue({ param: { [paramKey[0]]: undefined } });
    };
  }, []);

  useEffect(() => {
    const identification = form.getFieldValue(['param', paramKey[0]]);
    if (identification) {
      fetchClassifyGetMre({ identification });
    }
  }, [paramKey]);

  // 搜索虚拟商品折扣
  const fetchClassifyGetMre = debounce((data) => {
    if (!data) return;
    dispatch({
      type: 'baseData/fetchPagePreferentialActivity',
      payload: {
        type: showApi,
        ...data,
      },
    });
  }, 100);

  return (
    <FormItem
      key={`identification`}
      label="优惠活动名称"
      name={['param', paramKey[0]]}
      rules={[{ required: true, message: `请选择优惠活动名称` }]}
      style={{ maxWidth: '100%' }}
    >
      <Select
        placeholder={'请输入搜索'}
        select={virtualList}
        loading={loading}
        onSearch={(activityName) => fetchClassifyGetMre(activityName ? { activityName } : '')}
      ></Select>
    </FormItem>
  );
};

export default connect(({ baseData, loading }) => ({
  virtualList: baseData.virtualList.list,
  loading: loading.effects['baseData/fetchPagePreferentialActivity'],
}))(PhoneBill);
