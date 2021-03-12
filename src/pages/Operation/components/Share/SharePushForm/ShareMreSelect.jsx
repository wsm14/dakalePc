import React from 'react';
import { connect } from 'umi';
import debounce from 'lodash/debounce';
import FormCondition from '@/components/FormCondition';

const ShareMreSelect = (props) => {
  const { form, dispatch, selectList, saveDataStorage, loading, detail } = props;

  // 搜索店铺
  const fetchClassifyGetMre = debounce((merchantName) => {
    if (!merchantName) return;
    dispatch({
      type: 'businessList/fetchGetList',
      payload: {
        limit: 999,
        page: 1,
        bankStatus: 3,
        businessStatus: 1,
        merchantName,
      },
    });
  }, 500);

  const formItems = [
    {
      label: '选择店铺类型',
      name: 'userType',
      type: 'radio',
      select: { merchant: '单店' },
    },
    {
      label: '选择店铺',
      type: 'select',
      loading,
      placeholder: '请输入搜索',
      name: 'merchantId',
      select: selectList,
      onChange: (val, data) =>
        saveDataStorage({
          merchantId: val,
          topCategoryId: data.option.topCategoryId,
          topCategoryName: data.option.topCategoryName,
        }),
      onSearch: (val) => fetchClassifyGetMre(val),
    },
  ];

  return <FormCondition form={form} formItems={formItems} initialValues={detail}></FormCondition>;
};

export default connect(({ businessList, loading }) => ({
  selectList: businessList.selectList,
  loading: loading.models.businessList,
}))(ShareMreSelect);
