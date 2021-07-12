import React, { useContext } from 'react';
import { Collapse } from 'antd';
import panelItem from './panelItem';
import styles from './style.less';

const { Panel } = Collapse;

const ModuleDrawer = (props) => {
  const { context } = props;
  const { dispatchData, moduleData } = useContext(context);

  // 显示对应的模块编辑内容
  const handleShowEditor = (ptype, item) => {
    // 如果是公共模块 全局唯一只能存在一个 查询是否已经存在 存在则编辑
    const checkData = ptype === 'public' ? moduleData.findIndex((i) => i.id === item.id) : -1;
    dispatchData({
      type: 'showEditor',
      payload: {
        id: moduleData[checkData]?.id || new Date().getTime(), // 需要编辑的组件id
        index: checkData != -1 ? checkData : moduleData.length,
        type: item.type,
        name: item.text,
        moduleEditData: moduleData[checkData]?.data || {},
      },
    });
  };

  return (
    <div className={styles.active_Template_Left}>
      <Collapse bordered={false}>
        {panelItem.map((item) => (
          <Panel forceRender header={item.header} key={item.type}>
            <div className={styles.module_group}>
              {item.children.map((cell) => (
                <div
                  className={`${styles.module_cell} ${cell.drop ? styles.move : ''}`}
                  key={cell.text}
                  draggable={cell.drop}
                  onClick={() => handleShowEditor(item.type, cell)}
                >
                  <div className={styles.module_cell_icon}>{cell.icon}</div>
                  <span>{cell.text}</span>
                </div>
              ))}
            </div>
          </Panel>
        ))}
      </Collapse>
    </div>
  );
};

export default ModuleDrawer;
