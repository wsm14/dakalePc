import React from 'react';
import { Collapse } from 'antd';
import styles from '../style.less';
import { SelectOutlined } from '@ant-design/icons';

const { Panel } = Collapse;

const ActiveTemplateLeft = (props) => {
  const { onClose } = props;

  return (
    <div className={styles.active_Template_content}>
      <div className={styles.previewer_component}>
        <div className={styles.previewer_null}>
          <SelectOutlined />
        </div>
      </div>
    </div>
  );
};

export default ActiveTemplateLeft;
