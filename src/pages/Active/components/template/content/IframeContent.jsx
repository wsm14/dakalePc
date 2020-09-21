import React, { useState, useEffect, useContext } from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import IframeActive from './IframeActive';
import IframeActiveEdit from './IframeActiveEdit';
import styles from '../style.less';

const ActiveTemplateIframe = (props) => {
  const { context } = props;
  const { info, showPanel, dispatchData, iframeRef, componentsShow } = useContext(context);

  const [iframeShow, setIframeShow] = useState(true); // iframe 加载等待


  // ifarme 选择回调
  const handleIframeClick = (e) => {
    console.log('from iframe：', e.data);
    dispatchData({
      type: 'showPanel',
      payload: e.data.payload,
    });
    dispatchData({
      type: 'showEditor',
      payload: { type: '' },
    });
  };

  // 监听message事件;
  const receiveMessageFromIndex = (e) => {
    if (e != undefined) {
      const { type } = e.data;
      switch (type) {
        case 'select':
          handleIframeClick(e);
          return;
        case 'getHtml':
          dispatchData({
            type: 'showActive',
            payload: { activeHtml: e.data.payload },
          });
          return;
        default:
          return false;
      }
    }
  };

  useEffect(() => {
    window.addEventListener('message', receiveMessageFromIndex, false);
    return () => {
      window.removeEventListener('message', receiveMessageFromIndex);
    };
  }, []);

  return (
    <div className={styles.active_Template_content}>
      <IframeActiveEdit context={context} iref={iframeRef}></IframeActiveEdit>
      <div className={styles.previewer_component}>
        <IframeActive activeInfo={showPanel}></IframeActive>
        {componentsShow && (
          <Spin spinning={iframeShow} indicator={<LoadingOutlined style={{ fontSize: 24 }} />}>
            <div className={styles.previewer_wrap}>
              <iframe
                name="iframeId"
                ref={iframeRef}
                onLoad={() => setIframeShow(false)}
                scrolling="no"
                src={`${info.templateUrl}`}
                style={{ height: 757 }}
              ></iframe>
            </div>
          </Spin>
        )}
      </div>
    </div>
  );
};

export default ActiveTemplateIframe;
