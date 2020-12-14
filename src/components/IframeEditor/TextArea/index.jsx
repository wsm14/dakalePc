import React, { useImperativeHandle } from 'react';
import EditorForm from '../editorForm';

const TextAreaContent = (props) => {
  const { form, initialValues, cRef } = props;
  const formItems = [
    {
      label: '内容',
      type: 'textArea',
      name: 'data',
      required: true,
      maxLength: 100,
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

export default TextAreaContent;
