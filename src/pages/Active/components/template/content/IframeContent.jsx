import React, { useState, useRef, useEffect, useContext } from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import IframeActive from './IframeActive';
import IframeActiveEdit from './IframeActiveEdit';
import styles from '../style.less';

const ActiveTemplateIframe = (props) => {
  const { context } = props;
  const { info, showPanel, dispatchData, componentsShow } = useContext(context);

  const contentIFrameRef = useRef();
  const [iframeShow, setIframeShow] = useState(true); // iframe 加载等待

  useEffect(() => {
    const receiveMessageFromIndex = (e) => {
      if (e != undefined) {
        console.log('from iframe：', e.data);
        const { type } = e.data;
        switch (type) {
          case 'select':
            dispatchData({ type: 'showPanel', payload: e.data.payload });
            dispatchData({ type: 'showEditor', payload: { type: '' } });
            return;
          case 'query':
            return;
          default:
            return false;
        }
      }
    };
    // 监听message事件;
    window.addEventListener('message', receiveMessageFromIndex, false);
    return () => {
      window.removeEventListener('message', receiveMessageFromIndex);
    };
  }, []);

  // 向 iframe 发送数据
  const handleSendMessageTitle = () => {
    contentIFrameRef.current.contentWindow.postMessage(
      {
        type: 'save',
        payload: {
          id: '.page_lever3',
          type: 'title',
          content: {
            data: '测试标题传递',
            link: '',
            linkType: '',
          },
        },
      },
      '*',
    );
  };

  return (
    <div className={styles.active_Template_content}>
      <IframeActiveEdit context={context}></IframeActiveEdit>
      <div className={styles.previewer_component}>
        <IframeActive activeInfo={showPanel}></IframeActive>
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
