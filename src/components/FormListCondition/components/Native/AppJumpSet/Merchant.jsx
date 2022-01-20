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
const Merchant = ({
  owType = 'merchant',
  form,
  paramKey,
  dispatch,
  selectList,
  loading,
  onChange,
}) => {
  useEffect(() => {
    return () => {
      dispatch({ type: 'baseData/clearGroupMre' });
      form.setFieldsValue({ param: { [paramKey[0]]: undefined } });
    };
  }, []);

  useEffect(() => {
    const merchantId = form.getFieldValue(['param', paramKey[0]]);
    if (merchantId) {
      fetchClassifyGetMre({ merchantId });
    }
  }, [paramKey, owType]);

  // 搜索店铺
  const fetchClassifyGetMre = debounce((data) => {
    if (!data || !owType) return;
    dispatch({
      type: 'baseData/fetchGetGroupMreList',
      payload: {
        type: owType,
        ...data,
      },
    });
  }, 100);

  return (
    <FormItem
      key={`merchantIdStr`}
      label={{ merchant: '选择单店', group: '选择集团' }[owType] || '选择单店'}
      name={['param', paramKey[0]]}
      rules={[{ required: true, message: `请选择${{ merchant: '单店', group: '集团' }[owType]}` }]}
      style={{ maxWidth: '100%' }}
    >
      <Select
        placeholder={'请输入搜索'}
        select={selectList}
        loading={loading}
        onSearch={(name) => fetchClassifyGetMre(name ? { name } : '')}
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
