import React, { useImperativeHandle } from 'react';
import { Form } from 'antd';
import aliOssUpload from '@/utils/aliOssUpload';
import EditorForm from '../editorForm';
import NativeForm from '../NativeForm';
import showDomJs from './showDom';
import list_1 from './img/list_1.png';
import '../index.less';

/**
 * 单图配置
 */
const CommonList = (props) => {
  const { value = {}, editorType, cRef } = props;

  const [form] = Form.useForm();

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
      label: '模块样式',
      name: 'styleIndex',
      type: 'classSelect',
      required: true,
      select: [list_1],
    },
    {
      type: 'noForm',
      children: <NativeForm key="native" form={form}></NativeForm>,
    },
  ];

  return (
    <div className="active_template_editor_group">
      <div className="active_title">基础配置</div>
      {/* <div className="active_title_msg">图片默认宽度100%，高度自适应</div> */}
      <EditorForm formItems={formItems} initialValues={value || { styleIndex: 0 }} form={form} />
    </div>
  );
};

// 回显dom
CommonList.dom = showDomJs;

export default CommonList;
