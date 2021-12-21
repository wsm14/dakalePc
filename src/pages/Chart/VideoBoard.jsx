import React, { useReducer, useEffect, useState } from 'react';
import { connect } from 'umi';
import { Card, Affix, Row } from 'antd';
import { ChartVideoContext, initialState, reducer } from './components/VideoBoard/chartStore';
import SearchCard from './components/Block/Search/SearchCard';
import VideoChart from './components/VideoBoard/Chart/VideoChart';
import VideoInfoCard from './components/VideoBoard/Chart/VideoInfoCard';
import VideoAwardCard from './components/VideoBoard/Chart/VideoAwardCard';
import styles from './style.less';

const VideoBoard = ({
  location: {
    query: { bucket = '', beginDate = '', endDate = '' },
  },
  videoObject,
}) => {
  // 搜索参数
  const [searchData, setSearchData] = useReducer(reducer, {
    beginDate: beginDate || initialState.beginDate,
    endDate: endDate || initialState.endDate,
    provinceCode: bucket,
    status: '1',
  });
  // 时间参数
  const [timeData, setTimeData] = useState({
    beginDate: beginDate || initialState.beginDate,
    endDate: endDate || initialState.endDate,
  });
  // 城市参数
  const [cityData, setCityData] = useState({ provinceCode: bucket });

  // 选择时间
  const handleSearchData = (time, areaCode) => {
    let area = { provinceCode: undefined };
    if (areaCode && areaCode.length) {
      area = { provinceCode: areaCode[0], cityCode: areaCode[1], districtCode: areaCode[2] };
      setCityData(area);
    } else {
      area = {};
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
    <ChartVideoContext.Provider value={{ searchData, timeData, cityData, setSearchData }}>
      <div className={styles.chertBox}>
        <Affix offsetTop={49}>
          <Card bordered={false}>
            {/* 搜索框 */}
            <SearchCard
              setSearchData={handleSearchData}
              // timeData={timeData}
              // cityData={cityData}
              // bucket={bucket}
            ></SearchCard>
          </Card>
        </Affix>
        <Row gutter={[16]}>
          {/* 视频chart */}
          <VideoChart></VideoChart>
          {/* 新增视频情况 */}
          <VideoInfoCard
            data={videoObject}
            searchData={searchData}
            timeData={timeData}
          ></VideoInfoCard>
          {/* 视频打赏情况 */}
          <VideoAwardCard
            data={videoObject}
            searchData={searchData}
            timeData={timeData}
          ></VideoAwardCard>
        </Row>
      </div>
    </ChartVideoContext.Provider>
  );
};

export default connect(({ videoBoard, loading }) => ({
  videoObject: videoBoard.videoObject,
  loading: loading.effects['videoBoard/fetchMomentKanBan'],
}))(VideoBoard);
