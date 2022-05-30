import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import TradeBackList from './components/Trade/Tab/TradeBackList';
import TradeFrontList from './components/Trade/Tab/TradeFrontList';
const tabList = [
  {
    key: 'back',
    tab: '后台类目',
  },
  {
    key: 'front',
    tab: '前台类目',
  },
];
const TradeList = (props) => {
  const [tabkey, setTabKey] = useState('back');

  const listProps = { tabkey };

  const contentList = {
    back: <TradeBackList {...listProps}></TradeBackList>,
    front: <TradeFrontList {...listProps}></TradeFrontList>,
  };

  return (
    <>
      <Card tabList={tabList} activeTabKey={tabkey} onTabChange={(key) => setTabKey(key)}>
        {contentList[tabkey]}
      </Card>
    </>
  );
};
export default TradeList;
