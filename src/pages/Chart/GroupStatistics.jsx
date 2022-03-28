import React, { useState } from 'react';
import { connect } from 'umi';
import { Card, Statistic } from 'antd';
import QuestionTooltip from '@/components/QuestionTooltip';
import SearchCard from './components/GroupStatistics/SearchCard';
import './style.less';
const tabList = [
  {
    key: '0',
    tab: '拼团情况',
  },
];
const GroupStatistics = (props) => {
  const [activeTabKey, setActiveTabKey] = useState('0');

  const defaultSearch = {};

  const [searchData, setSearchData] = useState();

  const cardPropsList = [
    {
      title: '拼团成功金额',
      tip: '指拼团成功后拼中商品的用户所支付的金额',
      value: '￥233223',
    },
    {
      title: '拼团成功毛利金额',
      tip: '指拼团成功后，所有团的毛利金额。单个团毛利=拼中商品数*（商品售卖价-成本价）',
      value: '￥233223',
    },
    {
      title: '平台服务费',
      tip: '平台服务费=拼团成功毛利金额*10%，另外包含部分无渠道主的团，会把渠道主奖励分配到平台',
      value: '￥233223',
    },
    {
      title: '拼中红包奖励',
      tip: '拼中红包奖励=拼团成功毛利金额*50%',
      value: '￥233223',
    },
    {
      title: '渠道主奖励',
      tip: '渠道主奖励=拼团成功毛利金额*15%，无渠道主的团会把该部分奖励分到平台',
      value: '￥233223',
    },
    {
      title: '团长奖励',
      tip: '团长奖励=拼团成功毛利金额*25%',
      value: '￥233223',
    },
  ];

  return (
    <div className="wraperCon">
      <div>
        <Card tabList={tabList} activeTabKey={activeTabKey}>
          <div className="groupStaticHead bgColor">
            <span>累计开团次数</span>
            <span className="fontWeight">1223</span>
          </div>
          <div className="groupStaticItem groupStaticHead">
            <span>拼团中</span>
            <span className="fontWeight">1223</span>
          </div>
          <div className="groupStaticItem groupStaticHead">
            <span>拼团成功</span>
            <span className="fontWeight">1223</span>
          </div>
          <div className="groupStaticItem groupStaticHead">
            <span>拼团失败</span>
            <span className="fontWeight">1223</span>
          </div>
        </Card>
        <Card>
          <div className="groupStaticItem groupStaticHead">
            <span>开团人数</span>
            <span className="fontWeight">1223</span>
          </div>
          <div className="groupStaticItem groupStaticHead">
            <span>参团人数</span>
            <span className="fontWeight">1223</span>
          </div>
        </Card>
      </div>
      <div className="rightWrap">
        <SearchCard setSearchData={setSearchData}></SearchCard>
        <div className="rightCon">
          {cardPropsList.map((item) => (
            <Card
              key={item.title}
              title={
                <QuestionTooltip
                  type="quest"
                  title={item.title}
                  content={item.tip}
                ></QuestionTooltip>
              }
              className="cardItem"
            >
              <div style={{ textAlign: 'center' }}>
                <Statistic valueStyle={{ fontWeight: 'bold' }} value={item.value}></Statistic>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GroupStatistics;
