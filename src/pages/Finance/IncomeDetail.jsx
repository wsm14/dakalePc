import React, { useRef, useState } from 'react';
import { Card } from 'antd';
import OrderList from './components/Income/List/OrderList';
import SearchCard from './components/Income/Search/SearchCard';
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

const IncomeDetail = () => {
  // 表格ref
  const childRef = useRef();

  // tab激活项目
  const [tabkey, setTabKey] = useState('order');
  // 设置 修改 详情
  const [visible, setVisible] = useState(false);

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
      <Card tabList={tabList} onTabChange={(key) => setTabKey(key)}>
        <SearchCard></SearchCard>
        {contentList[tabkey]}
      </Card>
    </>
  );
};

export default IncomeDetail;
