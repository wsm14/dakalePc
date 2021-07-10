import React, { useState, useContext } from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import PreviewerActive from './PreviewerActive';
import styles from './style.less';

const ActiveTemplateIframe = (props) => {
  const { context } = props;
  const { info, showPanel, dispatchData, componentsShow } = useContext(context);

  const [iframeShow, setIframeShow] = useState(true); // iframe 加载等待

  return (
    <div className={styles.active_Template_content}>
      {/* <IframeActiveEdit context={context}></IframeActiveEdit> */}
      <div className={styles.previewer_component}>
        <PreviewerActive activeInfo={showPanel}></PreviewerActive>
        {componentsShow && (
          <Spin spinning={iframeShow} indicator={<LoadingOutlined style={{ fontSize: 24 }} />}>
            <div className={styles.previewer_wrap}></div>
          </Spin>
        )}
      </div>
    </div>
  );
};

export default ActiveTemplateIframe;
