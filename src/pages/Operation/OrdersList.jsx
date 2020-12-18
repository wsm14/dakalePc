import React, { useState } from 'react';
import { Card } from 'antd';
import OrderChart from './components/Orders/OrderChart';
import CodeOrders from './components/Orders/CodeOrders';
import GoodsOrders from './components/Orders/GoodsOrders';

const tabList = [
  {
    key: 'goods',
    tab: '商品订单',
  },
  {
    key: 'scan',
    tab: '扫码支付订单',
  },
];

const OrdersList = () => {
  const [tabkey, setTabKey] = useState('goods');

  const listProps = { tabkey };

  const contentList = {
    goods: <GoodsOrders {...listProps}></GoodsOrders>,
    scan: <CodeOrders {...listProps}></CodeOrders>,
  };

  return (
    <>
      <OrderChart></OrderChart>
      <Card tabList={tabList} activeTabKey={tabkey} onTabChange={(key) => setTabKey(key)}>
        {contentList[tabkey]}
      </Card>
    </>
  );
};

export default OrdersList;
