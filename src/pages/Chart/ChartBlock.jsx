import React, { useState } from 'react';
import { Card } from 'antd';
import moment from 'moment';
import ProvinceList from './components/Area/List/ProvinceList';
import CityList from './components/Area/List/CityList';
import SearchCard from './components/Area/Search/SearchCard';

const tabList = [
  {
    key: 'provinceCode',
    tab: '省份排行',
  },
  {
    key: 'cityCode',
    tab: '城市排行',
  },
];

const ChartBlockComponent = (props) => {
  const [tabkey, setTabKey] = useState('provinceCode');
  const [searchData, setSearchData] = useState({
    bucket: tabkey,
    areaCode: '33',
    beginDate: moment().format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
  });

  // 选择时间
  const handleSearchData = (time, provinceCode) => {
    setSearchData({
      bucket: tabkey,
      areaCode: provinceCode || searchData.areaCode,
      beginDate: time[0].format('YYYY-MM-DD'),
      endDate: time[1].format('YYYY-MM-DD'),
    });
  };

  const tableProps = {
    searchData: {
      ...searchData,
      bucket: tabkey,
    },
    tabkey,
  };

  const contentList = {
    provinceCode: <ProvinceList {...tableProps}></ProvinceList>,
    cityCode: <CityList {...tableProps}></CityList>,
  };

  return (
    <Card
      tabList={tabList}
      activeTabKey={tabkey}
      tabBarExtraContent={
        <SearchCard
          searchData={searchData}
          cityShow={tabkey == 'cityCode'}
          setSearchData={handleSearchData}
        ></SearchCard>
      }
      onTabChange={(key) => setTabKey(key)}
    >
      {contentList[tabkey]}
    </Card>
  );
};

export default ChartBlockComponent;
