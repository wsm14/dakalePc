import React, { useEffect, useState, useRef, useReducer, createContext } from 'react';
import { connect } from 'umi';
import { Drawer } from 'antd';
import { reducerValue, fetchReducerEdit } from './ActiveTemplateReducer';
import ActiveHeardTitle from './heard';
import ActivetTemplateLeft from './left';
import ActiveTemplateContent from './content/IframeContent';

const TemplateContext = createContext();

/**
 * @componentsShow 控制组件内子组件显示时间 Drawer afterVisibleChange后回调显示防止渲染卡顿
 * @moduleReducer 局部Reducer 此组件内公共参数
 */

const ActiveTemplate = (props) => {
  const { visible, onClose, dispatch, loading } = props;

  const iframeRef = useRef();
  const [moduleReducer, dispatchData] = useReducer(fetchReducerEdit, reducerValue);
  const [componentsShow, setComponentsShow] = useState(false);

  useEffect(() => {
    if (visible.show) {
      // 初始化数据
      dispatchData({ type: 'initialize' });
      // 保存选择模版信息
      dispatchData({ type: 'saveInfo', payload: visible });
      // 保存修改的活动信息
      if (visible.info.promotionActivityId) {
        dispatchData({ type: 'showActive', payload: { activeUrl: visible.info.templateUrl } });
      }
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
    <TemplateContext.Provider value={{ ...moduleReducer, iframeRef, dispatchData, componentsShow }}>
      <Drawer
        destroyOnClose
        bodyStyle={{ backgroundColor: '#f4f4f4' }}
        title={
          <ActiveHeardTitle
            promotionActivityId={visible.info && visible.info.promotionActivityId}
            loading={loading}
            onClose={onClose}
            dispatch={dispatch}
            context={TemplateContext}
          ></ActiveHeardTitle>
        }
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

export default connect(({ loading }) => ({
  loading: loading.models.activeTemplate,
}))(ActiveTemplate);
