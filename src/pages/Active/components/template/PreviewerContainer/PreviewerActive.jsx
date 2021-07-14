import React from 'react';
import { ArrowUpOutlined, ArrowDownOutlined, DeleteOutlined } from '@ant-design/icons';
import update from 'immutability-helper';
import styles from './style.less';

/**
 * 显示区域 高亮操作区域
 * @param {Boolean} show 是否显示状态
 * @param {Number} index 当前下标
 * @param {Array} data 当前数据
 * @returns
 */
export default ({ show, index, data, dispatchData }) => {
  // 删除数据
  const delDataCell = (e) => {
    e.stopPropagation();
    // 更新 data 数据源
    const movefile = update(data, { $splice: [[index, 1]] });
    // 高亮选择项目重置
    dispatchData({ type: 'showPanel', payload: null });
    // 数据变化储存
    dispatchData({ type: 'saveModuleData', payload: { data: movefile } });
  };

  // 移动数据 newIndex 新数据下标
  const moveDataCell = (e, newIndex) => {
    e.stopPropagation();
    // 更新 data 数据源
    const movefile = update(data, {
      $splice: [
        [index, 1],
        [newIndex, 0, data[index]],
      ],
    });
    // 高亮选择项目重置
    dispatchData({ type: 'showPanel', payload: newIndex });
    // 数据变化储存
    dispatchData({ type: 'saveModuleData', payload: { data: movefile } });
  };

  return (
    <>
      <div className={styles.previewer_title}>{data[index].text}</div>
      {/* 选择区域高亮 */}
      <div className={`${styles.previewer_active_warp} ${show ? styles.show : ''}`}></div>
      {show && (
        <div className={styles.previewer_active_tool}>
          <div className={styles.tool_group}>
            {index !== 0 && data.length > 1 && (
              <div className={styles.tool_cell} onClick={(e) => moveDataCell(e, index - 1)}>
                <ArrowUpOutlined style={{ fontSize: 18 }} />
              </div>
            )}
            {index !== data.length - 1 && (
              <div className={styles.tool_cell} onClick={(e) => moveDataCell(e, index + 1)}>
                <ArrowDownOutlined style={{ fontSize: 18 }} />
              </div>
            )}
          </div>
          <div className={styles.tool_group}>
            <div className={styles.tool_cell} onClick={delDataCell}>
              <DeleteOutlined style={{ fontSize: 18 }} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
