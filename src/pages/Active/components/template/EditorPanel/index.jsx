import React, { useContext } from 'react';
import { Button, Space } from 'antd';
import Editor from './Editor';
import styles from './style.less';

const EditorPanel = ({ context }) => {
  // 组件选项打开类型
  const { dispatchData, showEditor } = useContext(context);

  // 关闭编辑框
  const handleCloseEdit = () => {
    dispatchData({ type: 'closeEditor' });
  };

  const { type, name, moduleEditData } = showEditor;

  return (
    <div className={`${styles.active_Template_right} ${type ? styles.show : ''}`}>
      <div className={styles.heard}>
        {name}
        <div className={styles.divideLine}></div>
      </div>
      <div className={styles.content}>
        <Editor type={type}></Editor>
      </div>
      <div className={styles.footer}>
        <Space>
          <Button type="primary" onClick={handleCloseEdit}>
            保存
          </Button>
          <Button onClick={handleCloseEdit}>取消</Button>
        </Space>
      </div>
    </div>
  );
};

export default EditorPanel;
