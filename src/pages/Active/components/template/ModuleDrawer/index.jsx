import React, { useState, useContext } from 'react';
import { Collapse } from 'antd';
import panelItem from './panelItem';
import styles from './style.less';

const { Panel } = Collapse;

const ModuleDrawer = (props) => {
  const { context } = props;
  const { dispatchData } = useContext(context);

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
