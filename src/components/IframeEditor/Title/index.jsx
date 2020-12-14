import React, { useImperativeHandle } from 'react';
import EditorForm from '../editorForm';

const TitleContent = (props) => {
  const { form, initialValues, cRef } = props;
  const formItems = [
    {
      label: '标题',
      name: 'data',
      required: true,
      maxLength: 20,
    },
    {
      label: '链接',
      name: 'link',
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

export default TitleContent;
