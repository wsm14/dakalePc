import React, { useEffect, useReducer, createContext } from 'react';
import { connect } from 'umi';
import { Drawer } from 'antd';
import { reducerValue, fetchReducerEdit } from './ActiveTemplateReducer';
import SideMenu from './SideMenu';
import EditorPanel from './EditorPanel';
import ModuleDrawer from './ModuleDrawer';
import PreviewerContainer from './PreviewerContainer';

const TemplateContext = createContext();

/**
 * @moduleReducer 局部Reducer 此组件内公共参数
 */

const ActiveTemplate = (props) => {
  const { visible, onClose, loading } = props;

  const [moduleReducer, dispatchData] = useReducer(fetchReducerEdit, reducerValue);

  useEffect(() => {
    if (visible.show) {
      // 初始化数据
      dispatchData({ type: 'initialize' });
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
    <TemplateContext.Provider value={{ ...moduleReducer, dispatchData }}>
      <Drawer
        title={<SideMenu onClose={onClose} context={TemplateContext}></SideMenu>}
        height={'100%'}
        placement="top"
        closable={false}
        visible={visible.show}
        destroyOnClose
        headerStyle={{ borderBottom: '1px solid #e6e6e6' }}
        bodyStyle={{
          backgroundColor: '#e6e9ed',
          overflow: 'hidden',
          padding: 0,
          display: 'flex',
          alignItems: 'stretch',
          height: '100%',
        }}
      >
        <ModuleDrawer context={TemplateContext}></ModuleDrawer>
        <PreviewerContainer context={TemplateContext}></PreviewerContainer>
        <EditorPanel context={TemplateContext}></EditorPanel>
      </Drawer>
    </TemplateContext.Provider>
  );
};

export default connect(({ loading }) => ({
  loading: loading.models.activeTemplate,
}))(ActiveTemplate);
