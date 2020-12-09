import React, { useState } from 'react';
import { Card } from 'antd';
import moment from 'moment';
import ProvinceList from './components/Area/List/ProvinceList';
import CityList from './components/Area/List/CityList';
import SearchCard from './components/Area/Search/SearchCard';

const tabList = [
  {
    key: 'tab1',
    tab: '省份排行',
  },
  {
    key: 'tab2',
    tab: '城市排行',
  },
];

const AreaTotalComponent = (props) => {
  const [tabkey, setTabKey] = useState('tab1');
  const [searchData, setSearchData] = useState({
    provinceCode: '33',
    beginDate: moment().format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
  });

  // 选择时间
  const handleSearchData = (time, provinceCode = '33') => {
    setSearchData({
      provinceCode,
      beginDate: time[0].format('YYYY-MM-DD'),
      endDate: time[1].format('YYYY-MM-DD'),
    });
  };

  const tableProps = {
    searchData,
  };

  const contentList = {
    tab1: <ProvinceList {...tableProps}></ProvinceList>,
    tab2: <CityList {...tableProps}></CityList>,
  };

  return (
    <Card
      tabList={tabList}
      activeTabKey={tabkey}
      tabBarExtraContent={
        <SearchCard
          searchData={searchData}
          cityShow={tabkey == 'tab2'}
          setSearchData={handleSearchData}
        ></SearchCard>
      }
      onTabChange={(key) => setTabKey(key)}
    >
      {contentList[tabkey]}
    </Card>
  );
};

export default AreaTotalComponent;
