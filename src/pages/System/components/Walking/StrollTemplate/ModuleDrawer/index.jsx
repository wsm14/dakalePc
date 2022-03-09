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
  const dropItem = (cell) => {
    // 可拖拽组件
    const [, drag] = useDrag({
      item: { ...cell, type: 'Card' },
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
              {item.children.map((editorType) => dropItem(showImg[editorType]))}
            </div>
          </Panel>
        ))}
      </Collapse>
    </div>
  );
};

export default ModuleDrawer;
