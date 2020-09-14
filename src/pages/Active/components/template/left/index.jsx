import React from 'react';
import { Collapse } from 'antd';
import styles from '../style.less';

const { Panel } = Collapse;

const ActiveTemplateLeft = (props) => {
  const { onClose } = props;

  return (
    <div className={styles.active_Template_Left}>
      <Collapse bordered={false}>
        <Panel header="图片" key="1">
          <p>按钮</p>
        </Panel>
        <Panel header="按钮1" key="2">
          <p>按钮</p>
        </Panel>
        <Panel header="按钮2" key="3">
          按钮
        </Panel>
        <Panel header="按钮3" key="4">
          <p>按钮</p>
        </Panel>
        <Panel header="按钮4" key="5">
          按钮
        </Panel>
        <Panel header="按钮5" key="6">
          按钮
        </Panel>
      </Collapse>
    </div>
  );
};

export default ActiveTemplateLeft;
