import React from 'react';
import { Card } from 'antd';
const tabList = [
  {
    key: 'merchantVideo',
    tab: '商家食品',
  },
  {
    key: 'UGCVideo',
    tab: 'UGC视频',
  },
  {
    key: 'adVideo',
    tab: '广告视频',
  },
  {
    key: 'jigsawAd',
    tab: '拼图广告',
  },
  {
    key: 'shareBean',
    tab: '分享赚豆',
  },
];
const VideoConfig = () => {
  return <Card tabList={tabList}></Card>;
};
export default VideoConfig;
