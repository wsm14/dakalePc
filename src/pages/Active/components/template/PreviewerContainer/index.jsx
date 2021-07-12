import React, { useContext } from 'react';
import PreviewerActive from './PreviewerActive';
import styles from './style.less';

const ActiveTemplateIframe = (props) => {
  const { context } = props;
  const { info, showPanel, moduleData } = useContext(context);
  console.log(moduleData);
  return (
    <div className={styles.active_Template_content}>
      <div className={styles.previewer_component}>
        <PreviewerActive activeInfo={showPanel}></PreviewerActive>
        <div
          id="previewer_wrap"
          className={styles.previewer_wrap}
          style={{ backgroundColor: moduleData['backgroundColor'] }}
        ></div>
      </div>
    </div>
  );
};

export default ActiveTemplateIframe;
