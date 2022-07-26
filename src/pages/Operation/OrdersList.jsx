import React, { useState } from 'react';
import { Card } from 'antd';
import OrderChart from './components/Orders/OrderChart';
import CodeOrders from './components/Orders/CodeOrders';
import GoodsOrders from './components/Orders/GoodsOrders';
import OtherOrders from './components/Orders/OtherOrders';
import VirtualOrders from './components/Orders/VirtualOrders';
// import CommerceGoods from './components/Orders/CommerceGoods';
import CommunityGoods from './components/Orders/CommunityGoods';
import WinnerOrders from './components/Orders/WinnerOrders';
import SpecialGoods from './components/NewOrders/GoodsOrders';
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
  {
    key: 'goods',
    tab: '有价券订单',
  },
  // {
  //   key: 'commerceGoods',
  //   tab: '电商订单',
  // },
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
    key: 'communityGoods',
    tab: '团购订单',
  },
  {
    key: 'winnerOrders',
    tab: '中奖商品',
  },
];

const OrdersList = () => {
  const [tabkey, setTabKey] = useState('specialGoods');

  const listProps = { tabkey };

  const contentList = {
    specialGoods: <SpecialGoods {...listProps}></SpecialGoods>,
    commerceGoods: <CommerceGoods {...listProps}></CommerceGoods>,
    goods: <GoodsOrders {...listProps}></GoodsOrders>,
    // commerceGoods: <CommerceGoods {...listProps}></CommerceGoods>,
    scan: <CodeOrders {...listProps}></CodeOrders>,
    rightGoods: <OtherOrders {...listProps}></OtherOrders>,
    rightCoupon: <OtherOrders {...listProps}></OtherOrders>,
    virtualProduct: <VirtualOrders {...listProps}></VirtualOrders>,
    communityGoods: <CommunityGoods {...listProps}></CommunityGoods>,
    winnerOrders: <WinnerOrders {...listProps}></WinnerOrders>,
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
