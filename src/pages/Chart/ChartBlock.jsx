import React, { useReducer, useState } from 'react';
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

const ChartBlockComponent = ({
  location: {
    query: { bucket = '' },
  },
}) => {
  // 搜索参数
  const [searchData, setSearchData] = useReducer(reducer, {
    ...initialState,
    provinceCode: bucket,
  });
  // 时间参数
  const [timeData, setTimeData] = useState(initialState);
  // 城市参数
  const [cityData, setCityData] = useState({ provinceCode: bucket });

  // 选择时间
  const handleSearchData = (time, areaCode) => {
    console.log(areaCode);
    let area = { provinceCode: undefined };
    if (areaCode && areaCode.length) {
      area = { provinceCode: areaCode[0], cityCode: areaCode[1], districtCode: areaCode[2] };
      setCityData(area);
    } else {
      setCityData({});
    }
    const timeObj = {
      beginDate: time[0].format('YYYY-MM-DD'),
      endDate: time[1].format('YYYY-MM-DD'),
    };
    setTimeData(timeObj);
    setSearchData({
      ...area,
      ...timeObj,
    });
  };

  return (
    <ChartContext.Provider value={{ searchData, timeData, cityData, setSearchData }}>
      <div className={styles.chertBox}>
        <Affix offsetTop={49}>
          <Card bordered={false}>
            {/* 搜索框 */}
            <SearchCard
              setSearchData={handleSearchData}
              cityData={cityData}
              bucket={bucket}
            ></SearchCard>
          </Card>
        </Affix>
        {/* 营收统计 */}
        <OrderChart searchData={searchData}></OrderChart>
        {/* 用户数据统计 */}
        <UserChart searchData={searchData}></UserChart>
        {/* 销售情况 & 拜访情况 & 店铺情况（截止昨日）& 店铺视频统计*/}
        <ActiveChart></ActiveChart>
        {/* 圈层情况 & 圈层推荐情况 */}
        <MasterChart searchData={searchData}></MasterChart>
        {/* 入驻店铺行业分布 */}
        <TradeChart searchData={searchData}></TradeChart>
        {/* 商圈地图 */}
        <TradeAreaMap></TradeAreaMap>
        {/* 店铺营收排行 & 销售排行 */}
        <RankingTotal searchData={searchData} timeData={timeData}></RankingTotal>
      </div>
    </ChartContext.Provider>
  );
};

export default ChartBlockComponent;
