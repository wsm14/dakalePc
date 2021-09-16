import React, { useState, useEffect } from 'react';
import { Card, Result } from 'antd';
import { authCheck } from '@/layouts/AuthConsumer';
import Video from './components/Advertisement/Video';
import Open from './components/Advertisement/Open';
import Puzzle from './components/Advertisement/Puzzle';

const tabList = [
  {
    tab: '视频广告',
    key: 'video',
    auth: 'videoAd',
  },
  {
    tab: '开屏广告',
    key: 'open',
    auth: 'openAd',
  },
  {
    tab: '拼图广告',
    key: 'puzzle',
    auth: 'puzzleAd',
  },
];

const Advertisement = () => {
  const [tabKey, setTabKey] = useState(false); // tab页
  const check = authCheck(tabList); // 检查权限

  // 检查权限获取key默认显示tab
  useEffect(() => {
    setTabKey(check && check.length ? check[0]['key'] : false);
  }, []);

  return (
    <Card
      tabList={check}
      bodyStyle={{ padding: tabKey === 'open' ? 0 : 24 }}
      onTabChange={setTabKey}
    >
      {check && check.length ? (
        {
          video: <Video></Video>, // 视频广告
          open: <Open></Open>, // 开屏广告
          puzzle: <Puzzle></Puzzle>, // 拼图广告
        }[tabKey]
      ) : (
        <Result status="403" title="403" subTitle="暂无权限"></Result>
      )}
    </Card>
  );
};

export default Advertisement;
