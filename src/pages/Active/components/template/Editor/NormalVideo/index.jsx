import React, { useImperativeHandle } from 'react';
import aliOssUpload from '@/utils/aliOssUpload';
import EditorForm from '../editorForm';
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
      return form.validateFields().then(async (content) => {
        const sVideo = await aliOssUpload(content.url);
        const fImg = await aliOssUpload(content.poster);
        return { editorType, url: sVideo.toString(), poster: fImg.toString() };
      });
    },
  }));

  const formItems = [
    {
      label: '视频',
      name: 'url',
      type: 'upload',
      required: true,
      maxFile: 1,
      accept: 'video/mp4,.mp4',
    },
    {
      label: '视频封面',
      name: 'poster',
      type: 'upload',
      required: true,
      maxFile: 1,
      extra: '请上传尺寸为16:9的jpg、png图片',
    },
  ];

  return (
    <div className="active_template_editor_group">
      <div className="active_title">基础配置</div>
      <div className="active_title_msg">视频默认宽度100%，高度自适应</div>
      <EditorForm formItems={formItems} id={id} initialValues={value || {}} form={form} />
    </div>
  );
};

SolaImg.dom = showDomJs;

export default SolaImg;
