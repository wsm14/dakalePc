import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
import { connect } from 'umi';
import GameBean from './GameBean';
import GameEquity from './GameEquity';

const tabList = [
  {
    key: '0',
    tab: '电商品',
  },
  {
    key: '1',
    tab: '卡豆权益品',
  },
];

const GameType = ({ tabkey }) => {
  const [twoTabkey, setTwoTabKey] = useState('0');

  const listProps = { tabkey, twoTabkey };

  useEffect(() => {
    setTwoTabKey('0');
  }, [tabkey]);
  const contentList = {
    0: <GameBean {...listProps}></GameBean>,
    1: tabkey !== 'mark' && <GameEquity {...listProps}></GameEquity>,
  };
  return (
    <>
      <Card tabList={tabList} activeTabKey={twoTabkey} onTabChange={(key) => setTwoTabKey(key)}>
        {contentList[twoTabkey]}
      </Card>
    </>
  );
};
export default connect(({ boxLottery, loading }) => ({
  gameSignList: boxLottery.gameSignList,
  loading: loading.models.boxLottery,
}))(GameType);
