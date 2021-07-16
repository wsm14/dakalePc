import React, { useImperativeHandle } from 'react';
import { Form } from 'antd';
import aliOssUpload from '@/utils/aliOssUpload';
import EditorForm from '../editorForm';
import NativeForm from '../NativeForm';
import showDomJs from './showDom';
import '../index.less';

// 回显dom
const showDom = showDomJs;

/**
 * 单图配置
 */
const SolaImg = (props) => {
  const { value = {}, editorType, cRef } = props;

  const [form] = Form.useForm();

  // 向父组件暴露方法
  useImperativeHandle(cRef, () => ({
    getContent: () => {
      return form.validateFields().then((content) => {
        return aliOssUpload(content.data).then((res) => {
          return { ...content, editorType, data: res.toString() };
        });
      });
    },
  }));

  const formItems = [
    {
      label: '图片',
      name: 'data',
      type: 'upload',
      required: true,
      maxFile: 1,
    },
    {
      type: 'noForm',
      children: <NativeForm key="native" form={form}></NativeForm>,
    },
  ];

  return (
    <div className="active_template_editor_group">
      <div className="active_title">基础配置</div>
      <div className="active_title_msg">图片默认宽度100%，高度自适应</div>
      <EditorForm formItems={formItems} initialValues={value || {}} form={form} />
    </div>
  );
};

SolaImg.dom = showDom;

export default SolaImg;
