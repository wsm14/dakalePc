import React from 'react';
import EditorForm from '../editorForm';

const SourceSet = (props) => {
  const { form, initialValues } = props;

  const formItems = [
    {
      label: '数据源',
      name: 'data',
      required: true,
      type: 'select',
      name: 'link',
      select: [
        { value: 'aaa', name: '当季热卖' },
        { value: 'h5', name: '热门商品' },
        { value: 'navite', name: '卡豆乐园' },
      ],
    },
  ];

  return <EditorForm formItems={formItems} initialValues={initialValues} form={form}></EditorForm>;
};

export default SourceSet;
