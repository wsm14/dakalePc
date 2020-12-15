import React, { useState } from 'react';
import { Card, Affix } from 'antd';
import moment from 'moment';
import SearchCard from './components/Block/Search/SearchCard';
import OrderChart from './components/Block/Chart/OrderChart';
import UserChart from './components/Block/Chart/UserChart';
import ActiveChart from './components/Block/Chart/ActiveChart';
import MasterChart from './components/Block/Chart/MasterChart';
import styles from './style.less';

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
    <div className={styles.chertBox}>
      <Affix offsetTop={40}>
        <Card bordered={false}>
          <SearchCard searchData={searchData} setSearchData={handleSearchData}></SearchCard>
        </Card>
      </Affix>
      <OrderChart searchData={searchData}></OrderChart>
      <UserChart searchData={searchData}></UserChart>
      <ActiveChart searchData={searchData}></ActiveChart>
      <MasterChart searchData={searchData}></MasterChart>
    </div>
  );
};

export default ChartBlockComponent;
