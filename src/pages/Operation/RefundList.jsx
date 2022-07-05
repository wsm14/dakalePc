import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import RefundCommerceList from './components/RefundList/RefundCommerceList';
import RefundGroupList from './components/RefundList/RefundGroupList';
const tabList = [
  {
    key: 'commerceGoods',
    tab: '电商商品',
  },
  {
    key: 'communityGoods',
    tab: '团购订单',
  },
];
const RefundList = (props) => {
  const [tabkey, setTabKey] = useState('commerceGoods');

  const listProps = { outTabkey: tabkey };

  const contentList = {
    commerceGoods: <RefundCommerceList {...listProps}></RefundCommerceList>,
    communityGoods: <RefundGroupList {...listProps}></RefundGroupList>,
  };

  return (
    <>
      <Card tabList={tabList} activeTabKey={tabkey} onTabChange={(key) => setTabKey(key)}>
        {contentList[tabkey]}
      </Card>
    </>
  );
};
export default RefundList;
