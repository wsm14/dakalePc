import React, { useRef, useEffect, useContext } from 'react';
import { Button, Space, message, Form } from 'antd';
import update from 'immutability-helper';
import editorConfig from '../panel.config';
import styles from './style.less';

const EditorPanel = ({ context }) => {
  const cRef = useRef();
  // 组件选项打开类型 showPanel 当前高亮选项数据
  const { dispatchData, showEditor, showPanel, moduleData } = useContext(context);

  const { dataList } = moduleData;
  const { id, moduleName, name, drop, only = false, data } = showEditor;

  const [form] = Form.useForm();
  // 关闭编辑框
  const handleCloseEdit = () => dispatchData({ type: 'closeEditor' });

  // 每次重置数据显示
  useEffect(() => {
    if (id) form.setFieldsValue(data);
  }, [id]);
  /**
   * 保存事件
   * 判断是否可拖拽组件 drop 如果不是则数据唯一存在对象外围
   * 如果不是 比如 backgroundColor 则将数据保存在对象外围
   * 如果是 则保存在 moduleData 的 dataList[] 内
   */
  const handleSaveData = () => {
    cRef.current
      .getContent()
      .then((content) => {
        if (!content) return false;
        let payload = {};
        if (!drop && !only) {
          payload = content;
        } else {
          const newData = update(dataList, {
            $splice: [[only ? 0 : showPanel, 1, { ...showEditor, data: content }]],
          });
          payload = { dataList: newData };
        }
        console.log('saveModuleData', payload);
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
    <div
      className={`${styles.active_Template_right} ${styles[moduleName]} ${
        moduleName ? styles.show : ''
      }`}
    >
      <div className={styles.heard}>
        {name}
        <div className={styles.divideLine}></div>
      </div>
      <div className={styles.content}>
        <div className={styles.previewer_active_editor}>
          {editorConfig[moduleName] && editorConfig[moduleName].editorDom
            ? editorConfig[moduleName]?.editorDom({ id, form, cRef, moduleName, value: data })
            : '控件暂未配置'}
        </div>
      </div>
      <div className={styles.footer}>
        <Space>
          {editorConfig[moduleName] && editorConfig[moduleName].editorDom && (
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
