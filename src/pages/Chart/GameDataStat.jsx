import React, { useState } from 'react';
import { Card } from 'antd';
import UsageAnalysis from './components/UserDataStat/UsageAnalysis';
import UserPortrait from './components/UserDataStat/UserPortrait';
import AccumulativeData from './components/UserDataStat/AccumulativeData';
import ChannelData from './components/UserDataStat/ChannelData';

const tabList = [
  {
    key: 'usageAnalysis',
    tab: '使用分析',
  },
  // {
  //   key: 'realTimeData',
  //   tab: '实时数据',
  // },
  {
    key: 'userPortrait',
    tab: '用户画像',
  },
  {
    key: 'accumulativeData',
    tab: '累计数据',
  },
  {
    key: 'channelData',
    tab: '渠道数据',
  },
];

const GameDataStat = () => {
  const [tabkey, setTabkey] = useState('usageAnalysis');

  const contentList = {
    usageAnalysis: <UsageAnalysis></UsageAnalysis>,
    realTimeData: <>123</>,
    userPortrait: <UserPortrait></UserPortrait>,
    accumulativeData: <AccumulativeData></AccumulativeData>,
    channelData: <ChannelData></ChannelData>,
  };

  return (
    <Card
      bordered={false}
      tabList={tabList}
      activeTabKey={tabkey}
      onTabChange={(key) => {
        setTabkey(key);
      }}
      bodyStyle={{ paddingTop: 0 }}
    >
      {contentList[tabkey]}
    </Card>
  );
};

export default GameDataStat;
