import React, { useState } from 'react';
import { Card } from 'antd';
import moment from 'moment';
import SearchCard from './components/Block/Search/SearchCard';
import OrderChart from './components/Block/Chart/OrderChart';
import UserChart from './components/Block/Chart/UserChart';

const ChartBlockComponent = () => {
  const [searchData, setSearchData] = useState({
    beginDate: moment().format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
  });

  // 选择时间
  const handleSearchData = (time) => {
    setSearchData({
      beginDate: time[0].format('YYYY-MM-DD'),
      endDate: time[1].format('YYYY-MM-DD'),
    });
  };

  return (
    <Card
      title={<SearchCard searchData={searchData} setSearchData={handleSearchData}></SearchCard>}
    >
      <OrderChart searchData={searchData}></OrderChart>
      <UserChart searchData={searchData}></UserChart>
    </Card>
  );
};

export default ChartBlockComponent;
