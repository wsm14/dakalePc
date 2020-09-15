import React, { useState, useEffect, useContext } from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import styles from '../style.less';

const ActiveTemplateLeft = (props) => {
  const { context } = props;
  const [iframeShow, setIframeShow] = useState(true); // iframe 加载等待
  const { moduleData, dispatchData, componentsShow } = useContext(context);
  const { info } = moduleData;

  useEffect(() => {
    console.log(window);
    const receiveMessageFromIndex = (e) => {
      console.log('e', e);
      if (e != undefined) {
        console.log('我是react', 'e:', e, 'data:', e.data);
        // dispatchData({ type: 'save', payload: { showPanel: 'img' } });
      }
    };
    // 监听message事件;
    window.addEventListener('message', receiveMessageFromIndex, false);
    // return () => {
    //   window.removeEventListener('message', receiveMessageFromIndex);
    // };
  }, []);

  return (
    <div className={styles.active_Template_content}>
      <div className={styles.previewer_component}>
        {componentsShow && (
          <Spin spinning={iframeShow} indicator={<LoadingOutlined style={{ fontSize: 24 }} />}>
            <div className={styles.previewer_wrap}>
              <iframe
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

export default ActiveTemplateLeft;
