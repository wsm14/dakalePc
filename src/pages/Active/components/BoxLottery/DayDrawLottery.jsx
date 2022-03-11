import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
import { connect } from 'umi';
import GameBean from './GameBean';
import DayDrawOther from './DayDrawOther';

const tabList = [
  {
    key: '0',
    tab: '电商品',
  },
  {
    key: '1',
    tab: '其他',
  },
];

const DayDrawLottery = ({ tabkey }) => {
  const [twoTabkey, setTwoTabKey] = useState('0');

  const listProps = { tabkey, twoTabkey };

  useEffect(() => {
    setTwoTabKey('0');
  }, [tabkey]);
  const contentList = {
    0: <GameBean {...listProps}></GameBean>,
    1:  <DayDrawOther {...listProps}></DayDrawOther>,
  };
  return (
    <>
      <Card tabList={tabList} activeTabKey={twoTabkey} onTabChange={(key) => setTwoTabKey(key)}>
        {contentList[twoTabkey]}
      </Card>
    </>
  );
};
export default DayDrawLottery;
