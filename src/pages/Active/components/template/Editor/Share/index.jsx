import React, { useImperativeHandle, useState, useEffect } from 'react';
import aliOssUpload from '@/utils/aliOssUpload';
import EditorForm from '../editorForm';
import '../index.less';

/**
 * 分享配置
 */
const Share = (props) => {
  const { id, value = {}, editorType, cRef, form } = props;

  const [opens, setOpen] = useState(false);

  useEffect(() => {
    setOpen(value?.open || false);
    return () => {
      setOpen(false);
    };
  }, []);

  // 向父组件暴露方法
  useImperativeHandle(cRef, () => ({
    getContent: () => {
      return form.validateFields().then((content) => {
        if (!opens) return { [editorType]: null };
        return aliOssUpload(content.img).then((res) => {
          return { [editorType]: { ...content, editorType, img: res.toString() } };
        });
      });
    },
  }));

  const formItems = [
    {
      label: '启/停用',
      name: 'open',
      type: 'switch',
      valuePropName: 'checked',
      onChange: (e) => setOpen(e),
    },
    {
      label: '按钮图片',
      name: 'img',
      type: 'upload',
      required: true,
      maxFile: 1,
      visible: opens,
    },
    {
      label: '按钮宽',
      name: 'width',
      type: 'number',
      required: true,
      visible: opens,
    },
    {
      label: '按钮高',
      name: 'height',
      type: 'number',
      required: true,
      visible: opens,
    },
    {
      label: '按钮坐标X',
      name: 'x',
      type: 'number',
      required: true,
      visible: opens,
    },
    {
      label: '按钮坐标Y',
      name: 'y',
      type: 'number',
      required: true,
      visible: opens,
    },
  ];

  return (
    <div className="active_template_editor_group">
      <div className="active_title">基础配置</div>{' '}
      <div className="active_title_msg">小程序端暂无分享按钮</div>
      <EditorForm formItems={formItems} id={id} initialValues={value || {}} form={form} />
    </div>
  );
};

export default Share;
