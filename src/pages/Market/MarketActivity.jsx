import React, { useState } from 'react';
import { Card } from 'antd';
import MarketActivity from './components/MarketActivity/MarketActivity';
import SeckillTimeActivity from './components/MarketActivity/SeckillTimeActivity';

const tabList = [
  {
    key: 'seckillTime',
    tab: '限时秒杀',
  },
  {
    key: 'marketActivity',
    tab: '营销活动',
  },
];
const RefundOrder = () => {
  const [tabKey, setTabKey] = useState('seckillTime');

  const listProps = { tabKey: tabKey };

  const contentList = {
    seckillTime: <SeckillTimeActivity {...listProps}></SeckillTimeActivity>,
    marketActivity: <MarketActivity {...listProps}></MarketActivity>,
  };

  return (
    <>
      <Card
        tabList={tabList}
        bodyStyle={{ padding: "1px 0 0" }}
        activeTabKey={tabKey}
        onTabChange={(key) => setTabKey(key)}
      >
        {contentList[tabKey]}
      </Card>
    </>
  );
};
export default RefundOrder;
