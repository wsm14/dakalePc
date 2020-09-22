import React, { useRef } from 'react';
import { Button, Space, Form, message } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { IEditor } from './editorModule';
import styles from './index.less';

/**
 * 编辑模板
 * @type 组件编辑的类型
 * @onClose 关闭事件
 * @onSave 保存回调
 * @initialValues 默认值
 */
const IframeEditor = (props) => {
  const { type, showPanel, initialValues, onClose, onSave } = props;

  // 判断组件是否配置
  if (typeof IEditor[type] === 'undefined') {
    message.error('组件不存在，或未配置');
    return <div></div>;
  }

  const cRef = useRef();
  const [form] = Form.useForm();
  const EditorContent = IEditor[type];

  // 保存事件
  const handleSaveData = () => {
    cRef.current
      .getContent()
      .then((content) => {
        if (!content) return false;
        const messageType = content.apiUrl ? 'script' : 'save';
        onSave({ id: showPanel.id, type, messageType, content });
        return true;
      })
      .then((res) => {
        if (!res) return;
        message.destroy();
        message.success({
          content: '保存成功！',
          className: 'custom-class',
          style: {
            marginTop: '30vh',
          },
        });
      });
  };

  return (
    <>
      {type && (
        <div className={styles.previewer_active_editor} style={{ top: showPanel.top + 20 }}>
          <div className={styles.editor_title}>
            <div className={styles.editor_title_con}>模块编辑</div>
            <CloseOutlined onClick={onClose} />
          </div>
          <div className={styles.editor_content}>
            <EditorContent
              cRef={cRef}
              form={form}
              initialValues={initialValues}
              showPanel={showPanel}
            ></EditorContent>
          </div>
          <div className={styles.editor_footer}>
            <Space>
              <Button type="primary" onClick={handleSaveData}>
                保存
              </Button>
            </Space>
          </div>
        </div>
      )}
    </>
  );
};

export default IframeEditor;
