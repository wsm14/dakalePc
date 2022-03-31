import React, { useImperativeHandle } from 'react';
import aliOssUpload from '@/utils/aliOssUpload';
import { NewNativeFormSet } from '@/components/FormListCondition';
import EditorForm from '../editorForm';
import '../index.less';

/**
 * 顶部背景配置
 */
const TopBackground = (props) => {
  const { id, value = {}, cRef, form, info = {} } = props;
  const { params = {} } = info;
  const { userOs } = params;

  // 向父组件暴露方法
  useImperativeHandle(cRef, () => ({
    getContent: () => {
      return form.validateFields().then(async (content) => {
        const { topBackgroundImg, dynamicFile } = content;

        const topImg = await aliOssUpload(topBackgroundImg);
        const topFile = await aliOssUpload(dynamicFile);

        return { ...content, topBackgroundImg: topImg.toString(), dynamicFile: topFile.toString() };
      });
    },
  }));

  const formItems = [
    {
      label: '高度',
      name: 'height',
      type: 'number',
      addonAfter: 'px',
      min: 100,
      max: 999,
      precision: 0,
      required: true,
      extra: '可输入100-999之间的整数（含100和999）',
    },
    {
      label: '选择文件',
      name: 'dynamicFile',
      type: 'otherUpload',
      required: true,
      maxFile: 1,
      extra: '支持上传zip的格式',
      visible: ['iOS', 'android'].includes(userOs),
    },
    {
      label: '选择图片',
      name: 'topBackgroundImg',
      type: 'upload',
      required: true,
      maxFile: 1,
      extra: '支持上传png、gif的格式，仅支持1张',
      visible: ['weChat', 'mark'].includes(userOs),
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
    },
  ];

  return (
    <div className="active_template_editor_group">
      <div className="active_title_msg">
        图片默认宽度100%，默认高度400px，设计稿宽度为750px为基准，图片大小建议不大于200kb左右，图片过大影响页面访问速度
      </div>
      <EditorForm formItems={formItems} id={id} initialValues={value || {}} form={form} />
    </div>
  );
};

export default TopBackground;
