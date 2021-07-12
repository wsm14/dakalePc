import React, { useRef, useContext } from 'react';
import { Button, Space, message } from 'antd';
import Editor from './Editor';
import styles from './style.less';

const EditorPanel = ({ context }) => {
  const cRef = useRef();
  // 组件选项打开类型
  const { dispatchData, showEditor, moduleData } = useContext(context);

  const { type, name, moduleEditData } = showEditor;

  // 关闭编辑框
  const handleCloseEdit = () => {
    dispatchData({ type: 'closeEditor' });
  };

  // 保存事件
  const handleSaveData = () => {
    cRef.current
      .getContent()
      .then((content) => {
        if (!content) return false;
        return true;
      })
      .then((res) => {
        if (!res) return;
        message.destroy();
        message.success({
          content: '保存成功！',
          className: 'custom-class',
          style: {
            marginTop: '5vh',
          },
        });
      });
  };

  return (
    <div className={`${styles.active_Template_right} ${type ? styles.show : ''}`}>
      <div className={styles.heard}>
        {name}
        <div className={styles.divideLine}></div>
      </div>
      <div className={styles.content}>
        <Editor cRef={cRef} type={type}></Editor>
      </div>
      <div className={styles.footer}>
        <Space>
          <Button type="primary" onClick={handleSaveData}>
            保存
          </Button>
          <Button onClick={handleCloseEdit}>取消</Button>
        </Space>
      </div>
    </div>
  );
};

export default EditorPanel;
