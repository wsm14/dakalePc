import React, { useReducer } from 'react';
import { Card, Affix } from 'antd';
import { ChartContext, initialState, reducer } from './components/Block/chartStore';
import SearchCard from './components/Block/Search/SearchCard';
import OrderChart from './components/Block/Chart/OrderChart';
import UserChart from './components/Block/Chart/UserChart';
import ActiveChart from './components/Block/Chart/ActiveChart';
import MasterChart from './components/Block/Chart/MasterChart';
import TradeChart from './components/Block/Chart/TradeChart';
import TradeAreaMap from './components/Block/TradeAreaMap';
import RankingTotal from './components/Block/Chart/RankingTotal';
import styles from './style.less';

const ChartBlockComponent = () => {
  // 搜索参数
  const [searchData, setSearchData] = useReducer(reducer, initialState);

  // 选择时间
  const handleSearchData = (time) => {
    setSearchData({
      beginDate: time[0].format('YYYY-MM-DD'),
      endDate: time[1].format('YYYY-MM-DD'),
    });
  };

  return (
    <ChartContext.Provider value={{ searchData, setSearchData }}>
      <div className={styles.chertBox}>
        <Affix offsetTop={40}>
          <Card bordered={false}>
            {/* 搜索框 */}
            <SearchCard setSearchData={handleSearchData}></SearchCard>
          </Card>
        </Affix>
        {/* 营收统计 */}
        <OrderChart searchData={searchData}></OrderChart>
        {/* 用户数据统计 */}
        <UserChart searchData={searchData}></UserChart>
        {/* 销售情况 & 拜访情况 & 店铺情况（截止昨日）& 店铺视频统计*/}
        <ActiveChart></ActiveChart>
        {/* 圈层情况 & 圈层推荐情况 */}
        <MasterChart></MasterChart>
        {/* 入驻店铺行业分布 */}
        <TradeChart searchData={searchData}></TradeChart>
        {/* 商圈地图 */}
        {/* <TradeAreaMap></TradeAreaMap> */}
        {/* 店铺营收排行 & 销售排行 */}
        <RankingTotal></RankingTotal>
      </div>
    </ChartContext.Provider>
  );
};

export default ChartBlockComponent;
