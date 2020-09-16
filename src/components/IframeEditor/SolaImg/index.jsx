import React from 'react';
import EditorForm from '../editorForm';

const SolaImg = (props) => {
  const { form, showPanel } = props;
  const formItems = [
    {
      label: '图片',
      name: 'data',
      type: 'upload',
      required: true,
      isCut: true,
      ratio: 375 / showPanel.height,
      maxFile: 1,
    },
    {
      label: '链接',
      name: 'link',
    },
  ];

  return <EditorForm formItems={formItems} form={form}></EditorForm>;
};

export default SolaImg;
