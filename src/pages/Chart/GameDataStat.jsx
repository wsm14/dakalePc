import React, { useState } from 'react';
import { Card } from 'antd';
import EveryDayLottery from './components/EveryDayLottery/EveryDayLottery';

const tabList = [
  {
    key: 'everyDayLottery',
    tab: '天天抽奖',
  },
];

const GameDataStat = () => {
  const [tabkey, setTabkey] = useState('everyDayLottery');

  const contentList = {
    everyDayLottery: <EveryDayLottery></EveryDayLottery>,
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
