import React, { useState, useEffect } from 'react';
import { Card, Result } from 'antd';
import { authCheck } from '@/layouts/AuthConsumer';
// import Goods from './components/PlatformEquity/Goods';
import Coupon from './components/PlatformEquity/Coupon';
import GiveUserPrize from './components/PlatformEquity/components/GiveUserPrize';

/**
 * 平台权益
 */
const tabList = [
  // {
  //   tab: '权益商品',
  //   key: 'goods',
  //   auth: 'equityGoods',
  // },
  {
    tab: '权益券',
    key: 'coupon',
    auth: 'equityCoupon',
  },
];

const PlatformEquity = () => {
  const [tabKey, setTabKey] = useState('coupon'); // tab页
  const [givePrizeModal, setGivePrizeModal] = useState(false); // 赠送霸王餐
  const check = authCheck(tabList); // 检查权限

  // 检查权限获取key默认显示tab
  useEffect(() => {
    setTabKey(check && check.length ? check[0]['key'] : false);
  }, []);

  // 赠送霸王餐
  const handleGivePrize = (prizeData) => {
    setGivePrizeModal({ show: true, prizeData });
  };
  return (
    <Card tabList={check} onTabChange={setTabKey}>
      {check && check.length ? (
        {
          // goods: <Goods handleGivePrize={handleGivePrize}></Goods>, // 权益商品
          coupon: <Coupon handleGivePrize={handleGivePrize}></Coupon>, // 权益券
        }[tabKey]
      ) : (
        <Result status="403" title="403" subTitle="暂无权限"></Result>
      )}
      {/* 赠送霸王餐 */}
      <GiveUserPrize
        visible={givePrizeModal}
        onClose={() => setGivePrizeModal(false)}
      ></GiveUserPrize>
    </Card>
  );
};

export default PlatformEquity;
