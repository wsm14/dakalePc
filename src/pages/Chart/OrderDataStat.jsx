import React, { useState } from 'react';
import { Card } from 'antd';
import TrendAnalyse from './components/OrderDataStat/TrendAnalyse';
import PayMoneyAnalyse from './components/OrderDataStat/PayMoneyAnalyse';
import DealConversionAnalyse from './components/OrderDataStat/DealConversionAnalyse';
import BeanCounteractInfo from './components/OrderDataStat/BeanCounteractInfo';
import AreaPercentage from './components/OrderDataStat/AreaPercentage';

const tabList = [
  {
    key: 'trendAnalyse',
    tab: '趋势分析',
  },
  {
    key: 'payMoneyAnalyse',
    tab: '支付金额分析',
  },
  {
    key: 'dealConversionAnalyse',
    tab: '交易转化分析',
  },
  {
    key: 'beanCounteractInfo',
    tab: '卡豆抵扣情况',
  },
  {
    key: 'areaPercentage',
    tab: '地区占比',
  },
];

const OrderDataStat = () => {
  const [tabkey, setTabkey] = useState('trendAnalyse');

  const contentList = {
    trendAnalyse: <TrendAnalyse></TrendAnalyse>,
    payMoneyAnalyse: <PayMoneyAnalyse></PayMoneyAnalyse>,
    dealConversionAnalyse: <DealConversionAnalyse></DealConversionAnalyse>,
    beanCounteractInfo: <BeanCounteractInfo></BeanCounteractInfo>,
    areaPercentage: <AreaPercentage></AreaPercentage>,
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

export default OrderDataStat;
