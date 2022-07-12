import React, { useState } from 'react';
import { Card } from 'antd';
import BoxLotteryBean from './components/BoxLottery/BoxLotteryBean';
import GameType from './components/BoxLottery/GameType';
import HelpFreeList from './components/BoxLottery/HelpFreeList';
import DayDrawLottery from './components/BoxLottery/DayDrawLottery';

const tabList = [
  {
    key: 'boxLotteryBean',
    tab: '卡豆盲盒',
  },
  {
    key: 'gameSign',
    tab: '签到游戏',
  },
  {
    key: 'gameFree',
    tab: '免费领商品游戏',
  },
  {
    key: 'mark',
    tab: '哒小卡中奖',
  },
  {
    key: 'dailyLuckDraw',
    tab: '天天抽奖',
  },
  {
    key: 'gameGather',
    tab: '集碎片',
  },
  {
    key: 'gameFarm',
    tab: '卡豆农场',
  },
  {
    key: 'helpFree',
    tab: '助力免单',
  },
];
const BoxLottery = () => {
  const [tabkey, setTabKey] = useState('boxLotteryBean');

  const listProps = { tabkey };

  const contentList = {
    boxLotteryBean: <BoxLotteryBean {...listProps}></BoxLotteryBean>,
    gameSign: <GameType {...listProps}></GameType>,
    gameFree: <GameType {...listProps}></GameType>,
    mark: <GameType {...listProps}></GameType>,
    dailyLuckDraw: <DayDrawLottery {...listProps}></DayDrawLottery>,
    gameGather: <GameType {...listProps}></GameType>,
    gameFarm: <GameType {...listProps}></GameType>,
    helpFree: <HelpFreeList {...listProps}></HelpFreeList>,
  };

  return (
    <Card
      tabList={tabList}
      bodyStyle={{ padding: 0, paddingTop: 1 }}
      activeTabKey={tabkey}
      onTabChange={(key) => setTabKey(key)}
    >
      {contentList[tabkey]}
    </Card>
  );
};
export default BoxLottery;
