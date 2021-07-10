import React, { useContext } from 'react';
import styles from './style.less';

const EditorPanel = (props) => {
  const { context } = props;
  // 组件选项打开类型
  const { componentsShow } = useContext(context);

  return <>{componentsShow && <div className={styles.active_Template_right}></div>}</>;
};

export default EditorPanel;
