import React, { useEffect } from 'react';
import { Form } from 'antd';
import { IEditor } from './editorModule';
import styles from './index.less';

/**
 * 编辑模板
 * @type 组件编辑的类型
 * @value 默认值
 */
const IframeEditor = (props) => {
  const { cRef, type, value } = props;

  const [form] = Form.useForm();
  const EditorContent = IEditor[type];

  useEffect(() => {
    form.resetFields();
  }, [type]);

  return (
    <>
      {type && (
        <div className={styles.previewer_active_editor}>
          <EditorContent cRef={cRef} type={type} form={form} value={value}></EditorContent>
        </div>
      )}
    </>
  );
};

export default IframeEditor;
