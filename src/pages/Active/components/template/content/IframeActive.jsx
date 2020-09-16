import React from 'react';
import styles from '../style.less';

/**
 * iframe 选择区域高亮
 * @activeInfo {*}  定位信息
 */
const IframeActive = (props) => {
  const { activeInfo } = props;

  const { height } = activeInfo;

  return (
    <>
      {height > 0 && (
        <div className={styles.previewer_active_warp}>
          <div style={activeInfo} className={styles.previewer_active_mask}></div>
        </div>
      )}
    </>
  );
};

export default IframeActive;
