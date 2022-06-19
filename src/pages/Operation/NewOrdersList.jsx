import React, { useState } from 'react';
import { Card } from 'antd';
import GoodsOrders from './components/NewOrders/GoodsOrders';
import CommerceGoods from './components/NewOrders/CommerceGoods';

const tabList = [
  {
    key: 'specialGoods',
    tab: '特惠订单',
  },
  {
    key: 'commerceGoods',
    tab: '电商订单',
  },
];

const OrdersList = () => {
  const [tabkey, setTabKey] = useState('specialGoods');

  const listProps = { tabkey };

  const contentList = {
    specialGoods: <GoodsOrders {...listProps}></GoodsOrders>,
    commerceGoods: <CommerceGoods {...listProps}></CommerceGoods>,
  };

  return (
    <>
      <Card tabList={tabList} activeTabKey={tabkey} onTabChange={(key) => setTabKey(key)}>
        {contentList[tabkey]}
      </Card>
    </>
  );
};

export default OrdersList;
