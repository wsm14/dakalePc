import React, { useRef, useContext } from 'react';
import { Button, Space, message } from 'antd';
import update from 'immutability-helper';
import editor from '../Editor';
import styles from './style.less';

const EditorPanel = ({ context }) => {
  const cRef = useRef();
  // 组件选项打开类型
  const { dispatchData, showEditor, moduleData } = useContext(context);

  const { data } = moduleData;
  const { index, type, name, moduleEditData } = showEditor;

  // 关闭编辑框
  const handleCloseEdit = () => {
    // 高亮选择项目重置
    dispatchData({ type: 'showPanel', payload: null });
    // 关闭编辑框
    dispatchData({ type: 'closeEditor' });
  };

  /**
   * 保存事件
   * 判断是否是页面dom
   * 如果不是 比如 backgroundColor 则将数据保存在对象外围
   * 如果是 则保存在 moduleData 的 data[] 内
   */
  const handleSaveData = () => {
    cRef.current
      .getContent()
      .then((content) => {
        if (!content) return false;
        const { dom = true } = content;
        let payload = {};
        if (!dom) {
          payload = content.data;
        } else {
          const newData = update(data, {
            $splice: [[index, 1, content]],
          });
          payload = { data: newData };
        }
        dispatchData({
          type: 'saveModuleData',
          payload,
        });
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
        <div className={styles.previewer_active_editor}>
          {editor[type] && editor[type].editorDom
            ? editor[type]?.editorDom({ cRef, type, value: moduleEditData })
            : '控件暂未配置'}
        </div>
      </div>
      <div className={styles.footer}>
        <Space>
          {editor[type] && editor[type].editorDom && (
            <Button type="primary" onClick={handleSaveData}>
              保存
            </Button>
          )}
          <Button onClick={handleCloseEdit}>取消</Button>
        </Space>
      </div>
    </div>
  );
};

export default EditorPanel;
