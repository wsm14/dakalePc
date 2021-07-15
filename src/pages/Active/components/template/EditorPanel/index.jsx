import React, { useRef, useContext } from 'react';
import { Button, Space, message } from 'antd';
import update from 'immutability-helper';
import editor from '../Editor';
import styles from './style.less';

const EditorPanel = ({ context }) => {
  const cRef = useRef();
  // 组件选项打开类型
  const { dispatchData, showEditor, moduleData } = useContext(context);

  const { dataList } = moduleData;
  const { index, editorType, name, data } = showEditor;

  // 关闭编辑框
  const handleCloseEdit = () => dispatchData({ type: 'closeEditor' });

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
          const newData = update(dataList, {
            $splice: [[index, 1, { ...showEditor, data: content }]],
          });
          payload = { dataList: newData };
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
    <div className={`${styles.active_Template_right} ${editorType ? styles.show : ''}`}>
      <div className={styles.heard}>
        {name}
        <div className={styles.divideLine}></div>
      </div>
      <div className={styles.content}>
        <div className={styles.previewer_active_editor}>
          {editor[editorType] && editor[editorType].editorDom
            ? editor[editorType]?.editorDom({ cRef, editorType, value: data })
            : '控件暂未配置'}
        </div>
      </div>
      <div className={styles.footer}>
        <Space>
          {editor[editorType] && editor[editorType].editorDom && (
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
