import React, { useEffect, useState, useReducer, createContext } from 'react';
import { Drawer } from 'antd';
import { reducerValue, fetchReducerEdit } from './ActiveTemplateReducer';
import ActiveHeardTitle from './heard';
import ActivetTemplateLeft from './left';
import ActiveTemplateContent from './content/IframeContent';

const TemplateContext = createContext();

/**
 * @componentsShow 控制组件内子组件显示时间 Drawer afterVisibleChange后回调显示防止渲染卡顿
 * @moduleData 局部Reducer 此组件内公共参数
 */

const ActiveTemplate = (props) => {
  const { visible, onClose } = props;

  const [moduleData, dispatchData] = useReducer(fetchReducerEdit, reducerValue);
  const [componentsShow, setComponentsShow] = useState(false);

  useEffect(() => {
    if (visible.show) {
      // 初始化数据
      dispatchData({ type: 'initialize' });
      // 保存选择模版信息
      dispatchData({ type: 'saveInfo', payload: visible });
      // 拦截页面关闭刷新
      const listener = (ev) => {
        ev.preventDefault();
        ev.returnValue = '数据不保存，确定离开吗？';
      };
      window.addEventListener('beforeunload', listener);
      return () => {
        window.removeEventListener('beforeunload', listener);
      };
    }
  }, [visible.show]);

  return (
    <TemplateContext.Provider value={{ ...moduleData, dispatchData, componentsShow }}>
      <Drawer
        destroyOnClose
        bodyStyle={{ backgroundColor: '#f4f4f4' }}
        title={<ActiveHeardTitle onClose={onClose} context={TemplateContext}></ActiveHeardTitle>}
        height={'100%'}
        placement="top"
        closable={false}
        visible={visible.show}
        afterVisibleChange={(show) => setComponentsShow(show)}
      >
        <ActivetTemplateLeft context={TemplateContext}></ActivetTemplateLeft>
        <ActiveTemplateContent context={TemplateContext}></ActiveTemplateContent>
      </Drawer>
    </TemplateContext.Provider>
  );
};

export default ActiveTemplate;
