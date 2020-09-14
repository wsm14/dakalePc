import React, { useEffect } from 'react';
import { Drawer } from 'antd';
import ActiveHeardTitle from './heard';
import ActivetTemplateLeft from './left';
import ActiveTemplateContent from './content';

const ActiveTemplate = (props) => {
  const { visible, onClose } = props;

  // 拦截页面关闭刷新
  useEffect(() => {
    if (visible) {
      // const listener = (ev) => {
      //   ev.preventDefault();
      //   ev.returnValue = '文章要保存哦，确定离开吗？';
      // };
      // window.addEventListener('beforeunload', listener);
      // return () => {
      //   window.removeEventListener('beforeunload', listener);
      // };
    }
  }, [visible]);

  return (
    <Drawer
      destroyOnClose
      bodyStyle={{ backgroundColor: '#f4f4f4' }}
      title={<ActiveHeardTitle onClose={onClose}></ActiveHeardTitle>}
      height={'100%'}
      placement="top"
      closable={false}
      visible={visible}
    >
      <ActivetTemplateLeft></ActivetTemplateLeft>
      <ActiveTemplateContent></ActiveTemplateContent>
    </Drawer>
  );
};

export default ActiveTemplate;
