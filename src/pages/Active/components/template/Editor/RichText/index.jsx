import React, { useState, useImperativeHandle } from 'react';
import showDomJs from './showDom';
import RichTextForm from '@/components/EditorForm';
import EditorForm from '../editorForm';
import '../index.less';

/**
 * 富文本
 */
const SolaImg = (props) => {
  const { value = {}, editorType, id, cRef, form } = props;

  const [content, setContent] = useState(''); // 富文本内容

  // 向父组件暴露方法
  useImperativeHandle(cRef, () => ({
    getContent: () => {
      return form.validateFields().then((res) => {
        return { editorType, richText: content, ...res };
      });
    },
  }));

  const formItems = [
    {
      label: '富文本四周间距',
      name: 'padding',
      type: 'number',
      required: false,
    },
  ];

  return (
    <div className="active_template_editor_group">
      <div className="active_title">基础配置</div>
      <div className="active_title_msg">编辑页面仅参考，已实际生成页面为准</div>
      <EditorForm
        id={id}
        form={form}
        layout="horizontal"
        formItems={formItems}
        initialValues={value || {}}
      />
      <RichTextForm
        content={value?.richText || ''}
        contentClass={'active_editor_content'}
        editCallback={(val) => setContent(val)}
      ></RichTextForm>
    </div>
  );
};

SolaImg.dom = showDomJs;

export default SolaImg;
