import React, { useState } from 'react';
import { Card } from 'antd';
import { authCheck } from '@/layouts/AuthConsumer';
import CodeOrders from './components/Orders/CodeOrders';
import GoodsOrders from './components/Orders/GoodsOrders';

const tabList = [
  {
    key: 'equityGoods',
    auth: 'equityGoods',
    tab: '权益商品',
  },
  {
    key: 'equityCoupon',
    auth: 'equityCoupon',
    tab: '权益券',
  },
  {
    key: 'equityDummy',
    auth: 'equityDummy',
    tab: '虚拟权益',
  },
];

const PlatformEquityOrder = () => {
  const check = authCheck(tabList); // 检查权限
  const [tabkey, setTabKey] = useState(false);

  const listProps = { tabkey };

  return (
    <Card tabList={check} onTabChange={setTabKey}>
      {check && check.length ? (
        {
          equityCoupon: <GoodsOrders {...listProps}></GoodsOrders>, // 权益商品
          equityGoods: <CodeOrders {...listProps}></CodeOrders>, // 权益券
          equityDummy: <CodeOrders {...listProps}></CodeOrders>, // 虚拟权益
        }[tabkey]
      ) : (
        <Result status="403" title="403" subTitle="暂无权限"></Result>
      )}
    </Card>
  );
};

export default PlatformEquityOrder;
