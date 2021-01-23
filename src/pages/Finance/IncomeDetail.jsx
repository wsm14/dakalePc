import React, { useRef, useState } from 'react';
import moment from 'moment';
import { Card, Row, Col } from 'antd';
import IncomeTotal from './components/Income/Total';
import SearchCard from './components/Income/Search/SearchCard';
import OrderList from './components/Income/List/OrderList';
import ActionList from './components/Subsidys/List/ActionList';

const tabList = [
  {
    key: 'order',
    tab: '按单显示',
  },
  {
    key: 'day',
    tab: '按日显示',
  },
  {
    key: 'month',
    tab: '按月显示',
  },
];

// 搜索默认参数
const defaultValue = { time: [moment(), moment()], type: ['Apple', 'Pear', 'Orange', 'Oran1ge'] };

const IncomeDetail = () => {
  // 表格ref
  const childRef = useRef();

  // tab激活项目
  const [tabkey, setTabKey] = useState('order');
  // 设置 修改 详情
  const [visible, setVisible] = useState(false);
  // 搜索参数
  const [searchData, setSearchData] = useState(defaultValue);

  // 表格公共props
  const tableProp = {
    childRef,
    setVisible,
  };

  const contentList = {
    order: <OrderList {...tableProp}></OrderList>,
    day: <ActionList {...tableProp}></ActionList>,
    month: <ActionList {...tableProp}></ActionList>,
  };

  return (
    <>
      <Card
        tabList={tabList}
        onTabChange={(key) => {
          setTabKey(key);
          const tabTime = {
            order: [moment(), moment()],
            day: [moment().startOf('month'), moment()],
            month: [moment().startOf('year'), moment()],
          }[key];
          // 切换tab 重置时间选项
          setSearchData({ ...searchData, time: tabTime });
        }}
      >
        <SearchCard
          tabkey={tabkey}
          searchData={searchData}
          setSearchData={setSearchData}
        ></SearchCard>
        <IncomeTotal></IncomeTotal>
        {contentList[tabkey]}
      </Card>
    </>
  );
};

export default IncomeDetail;
