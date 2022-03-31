import React, { useImperativeHandle } from 'react';
import aliOssUpload from '@/utils/aliOssUpload';
import EditorForm from '../editorForm';
import '../index.less';

/**
 * 占位格配置
 */
const SpaceOccupyingLattice = (props) => {
  const { id, value = {}, cRef, form } = props;

  // 向父组件暴露方法
  useImperativeHandle(cRef, () => ({
    getContent: () => {
      return form.validateFields().then(async (content) => {
        return { ...content };
      });
    },
  }));

  const formItems = [
    {
      label: '高度',
      name: 'height',
      type: 'number',
      addonAfter: 'px',
      min: 1,
      max: 50,
      precision: 0,
      required: true,
    },
  ];

  return (
    <div className="active_template_editor_group">
      <EditorForm formItems={formItems} id={id} initialValues={value || {}} form={form} />
    </div>
  );
};

export default SpaceOccupyingLattice;
