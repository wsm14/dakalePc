import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import RefundOrderList from './components/RefundOrder/RefundOrderList';
import RefundGroupOrderList from './components/RefundOrder/RefundGroupOrderList';

const tabList = [
  {
    key: 'specialGoods',
    tab: '特惠订单',
  },
  {
    key: 'commerceGoods',
    tab: '电商订单',
  },
  {
    key: 'communityGoods',
    tab: '团购订单',
  },
];
const RefundOrder = () => {
  const [tabKey, setTabKey] = useState('specialGoods');

  const listProps = { tabKey: tabKey };

  const contentList = {
    specialGoods: <RefundOrderList {...listProps}></RefundOrderList>,
    commerceGoods: <RefundOrderList {...listProps}></RefundOrderList>,
    communityGoods: <RefundGroupOrderList {...listProps}></RefundGroupOrderList>,
  };

  return (
    <>
      <Card tabList={tabList} activeTabKey={tabKey} onTabChange={(key) => setTabKey(key)}>
        {contentList[tabKey]}
      </Card>
    </>
  );
};
export default RefundOrder;
