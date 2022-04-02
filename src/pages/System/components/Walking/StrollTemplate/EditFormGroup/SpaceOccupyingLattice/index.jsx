import React, { useImperativeHandle } from 'react';
import { NewNativeFormSet } from '@/components/FormListCondition';
import EditorForm from '../editorForm';
import '../index.less';

/**
 * 占位格配置
 */
const SpaceOccupyingLattice = (props) => {
  const { id, value = {}, cRef, form, info = {} } = props;
  const { params = {} } = info;
  const { userOs } = params;

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
      max: 100,
      precision: 0,
      required: true,
      extra: '可输入1-100之间的整数（含1和100）',
    },
    {
      type: 'noForm',
      formItem: (
        <NewNativeFormSet
          jumpTypeSelect={{
            '': '无',
            h5: 'H5',
            native: '原生页面',
          }}
          form={form}
          detail={value || {}}
        ></NewNativeFormSet>
      ),
      visible: ['iOS', 'android'].includes(userOs),
    },
  ];

  return (
    <div className="active_template_editor_group">
      <EditorForm formItems={formItems} id={id} initialValues={value || {}} form={form} />
    </div>
  );
};

export default SpaceOccupyingLattice;
