import React, { useContext } from 'react';
import { useDrag } from 'react-dnd';
import { Collapse } from 'antd';
import panelItem from '../panelItem';
import showImg from '../panel.config';
import styles from './style.less';

const { Panel } = Collapse;

/**
 * 组件拖拽区域
 */
const ModuleDrawer = (props) => {
  const { context, setStyBasket } = props;
  const { dispatchData, moduleData } = useContext(context);

  // 显示对应的模块编辑内容
  const handleShowEditor = (cell) => {
    const { dataList } = moduleData;
    const { editForm, defaultImg, icon, defaultData = {}, ...ohter } = cell;
    const dataIndex = dataList.findIndex((i) => i.moduleName === cell.moduleName);
    const data = dataList.filter((i) => i.moduleName === cell.moduleName)[0] || {};

    // 高亮选择项目 重置
    dispatchData({ type: 'showPanel', payload: null });
    // 编辑区域模组显示
    dispatchData({
      type: 'showEditor',
      payload: {
        ...defaultData,
        ...ohter,
        timestame: cell?.timestame || new Date().getTime(), // 需要编辑的组件id
        index: dataIndex != -1 ? dataIndex : dataList.length,
        ...data,
        param: JSON.parse(data?.param || '{}'),
      },
    });
  };

  // 组件显示项
  const paneDom = ({ drag, cell, onClick }) => (
    <div
      ref={drag}
      key={cell.moduleName}
      className={`${styles.module_cell} ${cell.drop ? styles.move : ''}`}
      onClick={onClick}
    >
      <div className={styles.module_cell_icon}>{cell.icon}</div>
      <span>{cell.name}</span>
    </div>
  );

  // 拖拽项目
  const dropItem = (moduleName) => {
    const cell = showImg[moduleName];
    // 不可拖拽组件
    if (!cell.drop) {
      return paneDom({ cell, onClick: () => handleShowEditor({ ...cell, moduleName }) });
    }
    // 可拖拽组件
    const [, drag] = useDrag({
      item: { ...cell, moduleName, type: 'Card' },
      // 开始拖拽 显示放置位置
      begin() {
        setStyBasket(true);
      },
      // 结束拖拽 隐藏放置位置
      end() {
        setStyBasket(false);
      },
    });
    return paneDom({ drag, cell });
  };

  return (
    <div className={styles.active_Template_Left}>
      <Collapse bordered={false}>
        {panelItem.map((item) => (
          <Panel forceRender header={item.header} key={item.type}>
            <div className={styles.module_group}>
              {item.children.map((editorType) => dropItem(editorType))}
            </div>
          </Panel>
        ))}
      </Collapse>
    </div>
  );
};

export default ModuleDrawer;
