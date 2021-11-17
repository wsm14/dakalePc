import React, { useState } from 'react';
import { Card } from 'antd';
import OrderChart from './components/Orders/OrderChart';
import CodeOrders from './components/Orders/CodeOrders';
import GoodsOrders from './components/Orders/GoodsOrders';
import OtherOrders from './components/Orders/OtherOrders';
import VirtualOrders from './components/Orders/VirtualOrders';
import CommerceOrders from './components/Orders/CommerceOrders';
import GroupBuyOrders from './components/Orders/GroupBuyOrders';

const tabList = [
  {
    key: 'goods',
    tab: '商品订单',
  },
  {
    key: 'scan',
    tab: '扫码支付订单',
  },
  {
    key: 'rightGoods',
    tab: '权益商品',
  },
  {
    key: 'rightCoupon',
    tab: '权益券',
  },
  {
    key: 'virtualProduct',
    tab: '虚拟商品',
  },
  {
    key: 'commerceOrders',
    tab: '电商订单',
  },
  // {
  //   key: 'groupBuyOrders',
  //   tab: '团购订单',
  // },
];

const OrdersList = () => {
  const [tabkey, setTabKey] = useState('goods');

  const listProps = { tabkey };

  const contentList = {
    goods: <GoodsOrders {...listProps}></GoodsOrders>,
    scan: <CodeOrders {...listProps}></CodeOrders>,
    rightGoods: <OtherOrders {...listProps}></OtherOrders>,
    rightCoupon: <OtherOrders {...listProps}></OtherOrders>,
    virtualProduct: <VirtualOrders {...listProps}></VirtualOrders>,
    commerceOrders: <CommerceOrders {...listProps}></CommerceOrders>,
    // groupBuyOrders: <GroupBuyOrders {...listProps}></GroupBuyOrders>,
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
