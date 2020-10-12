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
        { value: 'aaa', name: '当季热卖' },
        { value: 'h5', name: '热门商品' },
        { value: 'navite', name: '热销爆款' },
        { value: 'nae', name: '潜力新品' },
      ],
    },
    {
      label: '可选参数',
      name: ['param', 'num'],
      required: true,
      type: 'select',
      select: [
        { value: '1', name: '1' },
        { value: '2', name: '2' },
        { value: '3', name: '3' },
        { value: '4', name: '4' },
        { value: '5', name: '5' },
      ],
    },
    {
      label: '可选参数',
      name: ['param', 'num2'],
      required: true,
      type: 'select',
      select: [
        { value: '1', name: '1' },
        { value: '2', name: '2' },
        { value: '3', name: '3' },
        { value: '4', name: '4' },
        { value: '5', name: '5' },
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
