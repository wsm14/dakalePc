import React, { useImperativeHandle } from 'react';
import aliOssUpload from '@/utils/aliOssUpload';
import EditorForm from '../editorForm';
import NativeForm from '../NativeForm';
import showDomJs from './showDom';
import '../index.less';

/**
 * 单图配置
 */
const SolaImg = (props) => {
  const { id, value = {}, editorType, cRef, form } = props;

  // 向父组件暴露方法
  useImperativeHandle(cRef, () => ({
    getContent: () => {
      return form.validateFields().then((content) => {
        return aliOssUpload(content.img).then((res) => {
          return { ...content, editorType, img: res.toString() };
        });
      });
    },
  }));

  const formItems = [
    {
      label: '图片',
      name: 'img',
      type: 'upload',
      required: true,
      maxFile: 1,
    },
    {
      label: '图片宽度',
      name: 'width',
      type: 'number',
    },
    {
      label: '图片高度',
      name: 'height',
      type: 'number',
    },
    {
      type: 'noForm',
      children: <NativeForm key="native" form={form}></NativeForm>,
    },
  ];

  return (
    <div className="active_template_editor_group">
      <div className="active_title">基础配置</div>
      <div className="active_title_msg">
        图片默认宽度100%，高度自适应，设计稿宽度为750px为基准，图片大小建议不大于200kb左右，图片过大影响页面访问速度
      </div>
      <EditorForm formItems={formItems} id={id} initialValues={value || {}} form={form} />
    </div>
  );
};

SolaImg.dom = showDomJs;

export default SolaImg;
