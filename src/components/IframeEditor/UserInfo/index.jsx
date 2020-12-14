import React, { useImperativeHandle } from 'react';
import EditorForm from '../editorForm';

const UserInfoContent = (props) => {
  const { form, initialValues, cRef } = props;
  const formItems = [
    {
      label: '获取用户信息',
      name: 'apiUrl',
      type: 'switch',
      valuePropName: 'checked',
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

export default UserInfoContent;
