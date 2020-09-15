import React, { useState, useRef, useEffect, useContext } from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import IframeActive from './IframeActive';
import IframeActiveEdit from './IframeActiveEdit';
import styles from '../style.less';

const ActiveTemplateIframe = (props) => {
  const { context } = props;

  const contentIFrameRef = useRef();
  const [iframeShow, setIframeShow] = useState(true); // iframe 加载等待
  const [activeInfo, setActiveInfo] = useState({ top: 0, height: 0 }); // iframe 选择区域高亮
  const { moduleData, dispatchData, componentsShow } = useContext(context);
  const { info } = moduleData;

  useEffect(() => {
    const receiveMessageFromIndex = (e) => {
      if (e != undefined) {
        console.log('received data from iframe', e.data);
        setActiveInfo(e.data);
        dispatchData({ type: 'save', payload: { showPanel: e.data.type } });
        dispatchData({ type: 'showActiveEditor', payload: { type: '' } });
      }
    };
    // 监听message事件;
    window.addEventListener('message', receiveMessageFromIndex, false);
    return () => {
      window.removeEventListener('message', receiveMessageFromIndex);
    };
  }, []);

  // 向 iframe 发送数据
  const handleSendMessage = () => {
    contentIFrameRef.current.contentWindow.postMessage(1233, '*');
  };

  return (
    <div className={styles.active_Template_content}>
      <button onClick={handleSendMessage}>send message to iframe</button>
      <IframeActiveEdit context={context}></IframeActiveEdit>
      <div className={styles.previewer_component}>
        <IframeActive activeInfo={activeInfo}></IframeActive>
        {componentsShow && (
          <Spin spinning={iframeShow} indicator={<LoadingOutlined style={{ fontSize: 24 }} />}>
            <div className={styles.previewer_wrap}>
              <iframe
                ref={contentIFrameRef}
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
