import React, { useCallback } from 'react';
import { connect, withRouter } from 'umi';
import { Tabs } from 'antd';
import pageTabStyle from './index.less';

function KeepAliveTabs({ openedMenu, dispatch, history }) {
  const filterKey = (key) => {
    dispatch({
      type: 'userInfo/filterKey',
      payload: { key },
    });
  };

  const closeTopMenu = useCallback(
    (path, nextItem, isCurrent) => {
      if (nextItem) {
        filterKey(path);
      }
      if (nextItem && isCurrent) {
        history.replace(nextItem.path);
      }
    },
    [history, filterKey],
  );

  // 关闭当前顶部菜单
  const dropTab = (path, action) => {
    if (action === 'remove') {
      const newData = openedMenu.filter((i) => i.path !== path);
      const next = newData[newData.length - 1];
      if (next) {
        dispatch({
          type: 'userInfo/save',
          payload: { openedMenu: newData },
        });
      }
      closeTopMenu(path, next, path === history.location.pathname);
    }
  };

  return (
    <Tabs
      hideAdd
      type="editable-card"
      className={`page-tab ${pageTabStyle.page}`}
      onTabClick={(ev) => history.push(ev)}
      activeKey={history.location.pathname}
      onEdit={dropTab}
    >
      {openedMenu.map((pane, index) => (
        <Tabs.TabPane
          className={`${pageTabStyle.tabPage}`}
          style={{ background: 'transparent', paddingLeft: 0, paddingRight: 0 }}
          tab={pane.name}
          key={`${pane.path}`}
          closable={openedMenu.length > 1}
        />
      ))}
    </Tabs>
  );
}

export default connect(({ userInfo }) => ({
  openedMenu: userInfo.openedMenu,
}))(withRouter(KeepAliveTabs));
