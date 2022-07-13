import React, { useState } from 'react';
import { Card } from 'antd';
import ActivicyAssistance from './components/Assistance/ActivicyAssistance';
import BlindboxAssistance from './components/Assistance/BlindboxAssistance';

const tabList = [
  {
    key: 'blindbox',
    tab: '盲盒助力记录',
  },
  {
    key: 'activicy',
    tab: '活动裂变记录',
  },
];

const Assistance = () => {
  const [tabkey, setTabKey] = useState('blindbox');

  const contentList = {
    blindbox: <BlindboxAssistance></BlindboxAssistance>,
    activicy: <ActivicyAssistance></ActivicyAssistance>,
  };

  return (
    <Card tabList={tabList} activeTabKey={tabkey} onTabChange={(key) => setTabKey(key)}>
      {contentList[tabkey]}
    </Card>
  );
};

export default Assistance;
