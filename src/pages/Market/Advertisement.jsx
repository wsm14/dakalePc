import React, { useState } from 'react';
import { Card } from 'antd';
import ExtraButton from '@/components/ExtraButton';

const Advertisement = (props) => {
  const [tabKey, setTabKey] = useState('video'); // tab页

  const tabList = [
    {
      tab: '视频广告',
      key: 'video',
    },
    {
      tab: '开屏广告',
      key: 'open',
    },
    {
      tab: '拼图广告',
      key: 'puzzle',
    },
  ];

  return <Card tabList={tabList} onTabChange={setTabKey} tabBarExtraContent={'111'}></Card>;
};

export default Advertisement;
