import React, { useRef, useEffect, useContext } from 'react';
import { Button, Space, message, Form } from 'antd';
import update from 'immutability-helper';
import editorConfig from '../panel.config';
import editFormGroup from '../EditFormGroup';
import styles from './style.less';

const EditorPanel = ({ context }) => {
  const cRef = useRef();
  // 组件选项打开类型 showPanel 当前高亮选项数据
  const { dispatchData, showEditor, showPanel, moduleData } = useContext(context);

  const { dataList } = moduleData;
  const { id, moduleName, drop, only = false, index, ...other } = showEditor;

  const [form] = Form.useForm();

  // 关闭编辑框
  const handleCloseEdit = () => dispatchData({ type: 'closeEditor' });

  // 每次重置数据显示
  useEffect(() => {
    if (id) form.setFieldsValue(other);
  }, [id]);
  /**
   * 保存事件
   * 判断是否可拖拽组件 drop 如果不是则数据唯一存在对象外围
   * 如果不是 比如 backgroundColor 则将数据保存在对象外围
   * 如果是 则保存在 moduleData 的 dataList[] 内
   */
  const handleSaveData = () => {
    const params = { id, moduleName };
    cRef.current
      .getContent()
      .then((content) => {
        if (!content) return false;
        let payload = {};
        const newData = update(dataList, {
          $splice: [[only ? 0 : showPanel, 1, { ...params, ...content }]],
        });
        payload = { dataList: newData };
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

  const FormDom = editFormGroup[moduleName];

  // 检查控件是否存在
  const checkForm =
    editorConfig[moduleName] && editorConfig[moduleName].editFormFlag && editFormGroup[moduleName];

  return (
    <div
      className={`${styles.active_Template_right} ${styles[moduleName]} ${
        !!editorConfig[moduleName]?.editFormFlag ? styles.show : ''
      }`}
    >
      <div className={styles.heard}>
        {editorConfig[moduleName]?.name}
        <div className={styles.divideLine}></div>
      </div>
      <div className={styles.content}>
        <div className={styles.previewer_active_editor}>
          {checkForm ? (
            <FormDom id={id} form={form} cRef={cRef} value={other}></FormDom>
          ) : (
            '控件暂未配置'
          )}
        </div>
      </div>
      <div className={styles.footer}>
        <Space>
          {checkForm && (
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
