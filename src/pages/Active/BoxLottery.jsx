import React, { useState, useRef } from 'react';
import { Card } from 'antd';
import BoxLotteryBean from './components/BoxLottery/BoxLotteryBean';
import GameType from './components/BoxLottery/GameType';

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
];
const BoxLottery = () => {
  const [tabkey, setTabKey] = useState('boxLotteryBean');

  const listProps = { tabkey };

  const contentList = {
    boxLotteryBean: <BoxLotteryBean {...listProps}></BoxLotteryBean>,
    gameSign: <GameType {...listProps}></GameType>,
    gameFree: <GameType {...listProps}></GameType>,
    mark: <GameType {...listProps}></GameType>,
  };

  return (
    <>
      <Card tabList={tabList} activeTabKey={tabkey} onTabChange={(key) => setTabKey(key)}>
        {contentList[tabkey]}
      </Card>
    </>
  );
};
export default BoxLottery;
