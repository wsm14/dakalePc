import React, { useContext } from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import PreviewerActive from './PreviewerActive';
import styles from './style.less';

const ActiveTemplateIframe = (props) => {
  const { context } = props;
  const { info, showPanel, componentsShow } = useContext(context);

  return (
    <div className={styles.active_Template_content}>
      <div className={styles.previewer_component}>
        <PreviewerActive activeInfo={showPanel}></PreviewerActive>
        {componentsShow && <div id="previewer_wrap" className={styles.previewer_wrap}></div>}
      </div>
    </div>
  );
};

export default ActiveTemplateIframe;
