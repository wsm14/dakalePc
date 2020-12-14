import React, { useImperativeHandle } from 'react';
import EditorForm from '../editorForm';

const CommonList = (props) => {
  const { form, initialValues, cRef } = props;

  const formItems = [
    {
      label: '数据源',
      type: 'select',
      required: true,
      name: 'apiUrl',
      select: [
        { value: '/user/promotionRecommend/pageNearByMerchant', name: '热门商家' },
        { value: '/user/promotionRecommend/pageUserMerchantOrderByMark', name: '推荐商家' },
      ],
    },
  ];

  // 向父组件暴露方法
  useImperativeHandle(cRef, () => ({
    getContent: () => {
      return form.validateFields();
    },
  }));

  return <EditorForm formItems={formItems} initialValues={initialValues} form={form}></EditorForm>;
};

export default CommonList;
