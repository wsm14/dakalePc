import React, { useContext } from 'react';
import { useDrag } from 'react-dnd';
import { Collapse } from 'antd';
import MenuConfig from '../MenuConfig';
import editor from '../Editor';
import styles from './style.less';

const { Panel } = Collapse;

/**
 * 组件拖拽区域
 */
const ModuleDrawer = (props) => {
  const { context, setStyBasket } = props;
  const { dispatchData, moduleData, info = {} } = useContext(context);

  // 显示对应的模块编辑内容
  const handleShowEditor = (cell) => {
    const { dataList } = moduleData;
    // 如果是不可拖拽的模块 全局唯一只能存在一个 查询是否已经存在 存在则编辑
    const checkData = !cell.drop ? dataList.findIndex((i) => i.id === cell.id) : -1;
    // 高亮选择项目 重置
    !cell.drop && dispatchData({ type: 'showPanel', payload: null });
    // 编辑区域模组显示
    dispatchData({
      type: 'showEditor',
      payload: {
        id: dataList[checkData]?.id || new Date().getTime(), // 需要编辑的组件id
        index: checkData != -1 ? checkData : dataList.length,
        editorType: cell.editorType,
        name: cell.name,
        drop: cell.drop,
        data: !cell.drop ? moduleData[cell.editorType] : dataList[checkData]?.data || null,
      },
    });
  };

  // 组件显示项
  const paneDom = ({ drag, cell, onClick }) => (
    <div
      ref={drag}
      key={cell.editorType}
      className={`${styles.module_cell} ${cell.drop ? styles.move : ''}`}
      onClick={onClick}
    >
      <div className={styles.module_cell_icon}>{cell.icon}</div>
      <span>{cell.name}</span>
    </div>
  );

  // 拖拽项目
  const dropItem = (cell) => {
    // 不可拖拽组件
    if (!cell.drop) {
      return paneDom({ cell, onClick: () => handleShowEditor(cell) });
    }
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
      <Collapse bordered={false} defaultActiveKey={['img']}>
        {MenuConfig(info.type).map(
          (item) =>
            item.show && (
              <Panel forceRender header={item.header} key={item.type}>
                <div className={styles.module_group}>
                  {item.children.map(
                    (editorType) => editorType.show && dropItem(editor[editorType.type]),
                  )}
                </div>
              </Panel>
            ),
        )}
      </Collapse>
    </div>
  );
};

export default ModuleDrawer;
