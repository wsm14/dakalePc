import React, { useEffect, useState, useReducer, createContext } from 'react';
import { Drawer } from 'antd';
import ActiveHeardTitle from './heard';
import ActivetTemplateLeft from './left';
import ActiveTemplateContent from './content';

const TemplateContext = createContext();

/**
 * @componentsShow 控制组件内子组件显示时间 Drawer afterVisibleChange后回调显示防止渲染卡顿
 * @moduleData 局部Reducer 此组件内公共参数
 */

const ActiveTemplate = (props) => {
  const { visible, onClose } = props;

  const [componentsShow, setComponentsShow] = useState(false);
  const [moduleData, dispatchData] = useReducer((state, action) => {
    switch (action.type) {
      case 'save':
        return {
          ...state,
          ...action.payload,
        };
      case 'showPanel':
        return {
          ...state,
          ...action.payload,
        };
      default:
        return state;
    }
  }, {});

  // 拦截页面关闭刷新
  useEffect(() => {
    if (visible.show) {
      dispatchData({ type: 'save', payload: visible });
      // const listener = (ev) => {
      //   ev.preventDefault();
      //   ev.returnValue = '文章要保存哦，确定离开吗？';
      // };
      // window.addEventListener('beforeunload', listener);
      // return () => {
      //   window.removeEventListener('beforeunload', listener);
      // };
    }
  }, [visible.show]);

  return (
    <Drawer
      destroyOnClose
      bodyStyle={{ backgroundColor: '#f4f4f4' }}
      title={<ActiveHeardTitle onClose={onClose}></ActiveHeardTitle>}
      height={'100%'}
      placement="top"
      closable={false}
      visible={visible.show}
      afterVisibleChange={(show) => setComponentsShow(show)}
    >
      <TemplateContext.Provider value={{ moduleData, dispatchData, componentsShow }}>
        <ActivetTemplateLeft context={TemplateContext}></ActivetTemplateLeft>
        <ActiveTemplateContent context={TemplateContext}></ActiveTemplateContent>
      </TemplateContext.Provider>
    </Drawer>
  );
};

export default ActiveTemplate;
