import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import CategoryBackList from './components/Category/Tab/CategoryBackList';
import CategoryFrontList from './components/Category/Tab/CategoryFrontList';
const tabList = [
  {
    key: 'back',
    tab: '后台类目',
  },
  {
    key: 'front',
    tab: '前台类目',
  },
];
const GoodsCategory = (props) => {
  const [tabkey, setTabKey] = useState('back');

  const listProps = { tabkey };

  const contentList = {
    back: <CategoryBackList {...listProps}></CategoryBackList>,
    front: <CategoryFrontList {...listProps}></CategoryFrontList>,
  };

  return (
    <>
      <Card tabList={tabList} activeTabKey={tabkey} onTabChange={(key) => setTabKey(key)}>
        {contentList[tabkey]}
      </Card>
    </>
  );
};
export default GoodsCategory;
