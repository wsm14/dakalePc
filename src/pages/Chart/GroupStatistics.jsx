import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import moment from 'moment';
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
  const { dispatch, loading, realTimeData = {}, staticsData = {} } = props;

  const [timeData, setTimeData] = useState([
    moment().subtract(1, 'day'),
    moment().subtract(1, 'day'),
  ]);
  useEffect(() => {
    handleStatistic();
  }, []);

  useEffect(() => {
    //搜索
    handleReport(timeData);
  }, [timeData]);

  //实时数据
  const handleStatistic = () => {
    dispatch({
      type: 'groupStatistics/fetchTogetherRebateStatistic',
    });
  };

  // 统计数据
  const handleReport = (time) => {
    dispatch({
      type: 'groupStatistics/fetchTogetherRebateReport',
      payload: {
        beginDate: time.length > 0 ? time[0].format('YYYY-MM-DD') : '',
        endDate: time.length > 0 ? time[1].format('YYYY-MM-DD') : '',
      },
    });
  };

  const cardRealTime = [
    {
      title: '累计开团次数',
      value:
        realTimeData.openingCount + realTimeData.openSuccessCount + realTimeData.openFailureCount,
    },
    {
      title: '拼团中',
      value: realTimeData.openingCount,
    },
    {
      title: '拼团成功',
      value: realTimeData.openSuccessCount,
    },
    {
      title: '拼团失败',
      value: realTimeData.openFailureCount,
    },
    {
      title: '开团人数',
      value: realTimeData.openUserCount,
    },
    {
      title: '参团人数',
      value: realTimeData.joinUserCount,
    },
  ];

  const cardPropsList = [
    {
      title: '拼团成功金额',
      tip: '指拼团成功后拼中商品的用户所支付的金额',
      value: staticsData.totalWinFee,
    },
    {
      title: '拼团成功毛利金额',
      tip: '指拼团成功后，所有团的毛利金额。单个团毛利=拼中商品数*（商品售卖价-成本价）',
      value: staticsData.totalProfitFee,
    },
    {
      title: '平台服务费',
      tip: '平台服务费=拼团成功毛利金额*10%，另外包含部分无渠道主的团，会把渠道主奖励分配到平台',
      value: staticsData.totalCommissionFee,
    },
    {
      title: '拼中红包奖励',
      tip: '拼中红包奖励=拼团成功毛利金额*50%',
      value: staticsData.totalNotWinFee,
    },
    {
      title: '渠道主奖励',
      tip: '渠道主奖励=拼团成功毛利金额*15%，无渠道主的团会把该部分奖励分到平台',
      value: staticsData.totalChannelOwnerFee,
    },
    {
      title: '团长奖励',
      tip: '团长奖励=拼团成功毛利金额*25%',
      value: staticsData.totalTeamLeaderFee,
    },
  ];

  return (
    <Card tabList={tabList} activeTabKey={'0'}>
      <div className="wraperCon">
        <div>
          <Card>
            {cardRealTime.map((RealItem) => (
              <div className="groupStaticItem groupStaticHead" key={RealItem.title}>
                <span>{RealItem.title}</span>
                <span className="fontWeight">{RealItem.value}</span>
              </div>
            ))}
          </Card>
        </div>
        <div className="rightWrap">
          <SearchCard setTimeData={setTimeData} timeData={timeData}></SearchCard>
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
                  <Statistic
                    valueStyle={{ fontWeight: 'bold' }}
                    precision={2}
                    value={item.value}
                  ></Statistic>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default connect(({ loading, groupStatistics }) => ({
  loading: loading.models.groupStatistics,
  realTimeData: groupStatistics.realTimeData,
  staticsData: groupStatistics.staticsData,
}))(GroupStatistics);
