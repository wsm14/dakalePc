import React, { useImperativeHandle } from 'react';
import EditorForm from '../editorForm';
import aliOssUpload from '@/utils/aliOssUpload';
import styles from './index.less';

const SolaImg = (props) => {
  const { form, initialValues, showPanel, cRef } = props;
  const formItems = [
    {
      label: '图片',
      name: 'data',
      type: 'upload',
      required: true,
      isCut: true,
      ratio: 375 / showPanel.height,
      maxFile: 1,
      className: styles.ifame_solaImg,
    },
    {
      label: '链接',
      name: 'link',
    },
  ];

  // 向父组件暴露方法
  useImperativeHandle(cRef, () => ({
    getContent: () => {
      return form.validateFields().then((content) => {
        return aliOssUpload(content.data).then((res) => {
          return { ...content, data: res.toString() };
        });
      });
    },
  }));

  return <EditorForm formItems={formItems} initialValues={initialValues} form={form}></EditorForm>;
};

export default SolaImg;
