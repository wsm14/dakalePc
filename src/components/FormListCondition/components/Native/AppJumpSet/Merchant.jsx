import React, { useEffect } from 'react';
import { connect } from 'umi';
import { Form } from 'antd';
import debounce from 'lodash/debounce';
import { Select } from '@/components/FormCondition/formModule';

const FormItem = Form.Item;

/**
 * 选择店铺
 * @param {Array} paramKey app跳转参数键值
 */
const Merchant = ({ form, paramKey, dispatch, selectList, loading, onChange }) => {
  useEffect(() => {
    return () => {
      dispatch({ type: 'baseData/clearGroupMre' });
      form.setFieldsValue({ param: { [paramKey[0]]: undefined } });
    };
  }, []);

  // 搜索店铺
  const fetchClassifyGetMre = debounce((name) => {
    if (!name) return;
    dispatch({
      type: 'baseData/fetchGetGroupMreList',
      payload: { name },
    });
  }, 500);

  return (
    <FormItem
      key={`merchantIdStr`}
      label="选择店铺"
      name={['param', paramKey[0]]}
      rules={[{ required: true, message: `请选择店铺` }]}
      style={{ maxWidth: '100%' }}
    >
      <Select
        placeholder={'请输入搜索'}
        select={selectList}
        loading={loading}
        onSearch={fetchClassifyGetMre}
        onChange={(val) => {
          onChange && onChange(val);
        }}
      ></Select>
    </FormItem>
  );
};

export default connect(({ baseData, loading }) => ({
  selectList: baseData.groupMreList,
  loading: loading.effects['baseData/fetchGetGroupMreList'],
}))(Merchant);
