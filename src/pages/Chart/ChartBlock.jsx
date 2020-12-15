import React, { useState } from 'react';
import { Card } from 'antd';
import moment from 'moment';
import SearchCard from './components/Block/Search/SearchCard';

const ChartBlockComponent = () => {
  const [searchData, setSearchData] = useState({
    areaCode: '33',
    beginDate: moment().format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
  });

  // 选择时间
  const handleSearchData = (time, provinceCode) => {
    setSearchData({
      areaCode: provinceCode || searchData.areaCode,
      beginDate: time[0].format('YYYY-MM-DD'),
      endDate: time[1].format('YYYY-MM-DD'),
    });
  };

  return (
    <Card
      title={<SearchCard searchData={searchData} setSearchData={handleSearchData}></SearchCard>}
    >
      1231
    </Card>
  );
};

export default ChartBlockComponent;
