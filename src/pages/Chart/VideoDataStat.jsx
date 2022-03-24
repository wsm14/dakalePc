import React, { useState } from 'react';
import { Card } from 'antd';
import TrendAnalysis from './components/VideoDataStat/TrendAnalysis';
import VideoNum from './components/VideoDataStat/VideoNum';
import PlayAnalysis from './components/VideoDataStat/PlayAnalysis';
import UGCVideoCondition from './components/VideoDataStat/UGCVideoCondition';

const tabList = [
  {
    key: 'trendAnalysis',
    tab: '趋势分析',
  },
  {
    key: 'videoNum',
    tab: '视频数量',
  },
  {
    key: 'playAnalysis',
    tab: '播放分析',
  },
  {
    key: 'ugcVideoCondition',
    tab: 'UGC视频打赏情况',
  },
];

const VideoDataStat = () => {
  const [tabkey, setTabkey] = useState('trendAnalysis');

  const contentList = {
    trendAnalysis: <TrendAnalysis></TrendAnalysis>,
    videoNum: <VideoNum></VideoNum>,
    playAnalysis: <PlayAnalysis></PlayAnalysis>,
    ugcVideoCondition: <UGCVideoCondition></UGCVideoCondition>,
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

export default VideoDataStat;
