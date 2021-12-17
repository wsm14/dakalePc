import React from 'react';
import { Tabs } from 'antd';
import { useHistory, useLocation } from 'umi';
import { useAliveController } from 'react-activation';

import pageTabStyle from './index.less';

export default function KeepAliveTabs() {
  const history = useHistory();
  const location = useLocation();
  const { getCachingNodes, dropScope } = useAliveController();
  const cachingNodes = getCachingNodes();
  const closable = cachingNodes.length > 1;
  const dropTab = (currentUrl, action) => {
    if (action === 'remove') {
      const currentName = cachingNodes.filter((item) => item.url === currentUrl).pop().name;
      // 如果关闭激活中的 KeepAlive Tab，需要先离开当前路由
      // 触发 KeepAlive unactivated 后再进行 drop
      if (location.pathname == currentUrl) {
        const unlisten = history.listen(() => {
          setTimeout(() => {
            dropScope(currentName);
          }, 60);
        });

        // 前往排除当前 node 后的最后一个 tab
        history.push(cachingNodes.filter((item) => item.url !== currentUrl).pop().url);
        unlisten();
      } else {
        dropScope(currentName);
      }
    }
  };

  return (
    <Tabs
      hideAdd
      type="editable-card"
      className={`page-tab ${pageTabStyle.page}`}
      onTabClick={(ev) => history.push(ev)}
      activeKey={location.pathname}
      onEdit={dropTab}
    >
      {cachingNodes
        .filter((i) => i.url)
        .map((pane, index) => (
          <Tabs.TabPane
            className={`${pageTabStyle.tabPage}`}
            style={{ background: 'transparent', paddingLeft: 0, paddingRight: 0 }}
            tab={pane.name}
            key={`${pane.url}`}
            closable={closable}
          />
        ))}
    </Tabs>
  );
}
