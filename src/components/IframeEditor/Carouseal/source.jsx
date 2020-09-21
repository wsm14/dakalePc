import React from 'react';
import EditorForm from '../editorForm';

const SourceSet = (props) => {
  const { form, initialValues } = props;

  const formItems = [
    {
      label: '显示数量',
      name: 'datasda',
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
      label: '数据源',
      type: 'select',
      required: true,
      name: 'link',
      select: [
        { value: 'aaa', name: '当季热卖' },
        { value: 'h5', name: '热门商品' },
        { value: 'navite', name: '热销爆款' },
        { value: 'nae', name: '潜力新品' },
      ],
    },
  ];

  return <EditorForm formItems={formItems} initialValues={initialValues} form={form}></EditorForm>;
};

export default SourceSet;
