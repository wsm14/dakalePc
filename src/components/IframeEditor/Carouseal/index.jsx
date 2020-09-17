import React, { useImperativeHandle } from 'react';
import EditorForm from '../editorForm';
import aliOssUpload from '@/utils/aliOssUpload';

const Carouseal = (props) => {
  const { form, initialValues, showPanel, cRef } = props;
  const formItems = [
    {
      label: '图片',
      name: '',
      type: 'carouseal',
      isCut: true,
      ratio: 375 / showPanel.height,
      maxFile: 1,
      children: {
        dname: ['content[0]', 'data'],
        lname: ['content[0]', 'link'],
      },
    },
    {
      label: '链接',
      name: 'link',
    },
  ];

  // 向父组件暴露方法
  useImperativeHandle(cRef, () => ({
    getContent: () => {
      form.validateFields().then((content) => {
        console.log(content);
        // return aliOssUpload(content.data).then((res) => {
        //   return { ...content, data: res.toString() };
        // });
      });
    },
  }));

  return <EditorForm formItems={formItems} initialValues={initialValues} form={form}></EditorForm>;
};

export default Carouseal;
