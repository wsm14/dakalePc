import React, { useState, useEffect } from 'react';
import { Card, Result } from 'antd';
import { authCheck } from '@/layouts/AuthConsumer';
import MerchantList from './components/Withdraw/MerchantList';
import MerchantListCash from './components/Withdraw/MerchantListCash';
import ExpertUserList from './components/Withdraw/ExpertUserList';
import AllianceTab from './components/Withdraw/AllianceTab';
import WithdrawGroup from './components/Withdraw/WithdrawGroup';

const tabList = [
  {
    key: 'withdrawMerchant',
    auth: 'withdrawMerchant',
    tab: '店铺卡豆提现',
  },
  {
    key: 'withdrawMerchantCash',
    auth: 'withdrawMerchantCash',
    tab: '店铺现金提现',
  },
  {
    key: 'withdrawExpert',
    auth: 'withdrawExpert',
    tab: '哒人提现',
  },
  {
    key: 'withdrawAlliance',
    auth: 'withdrawAlliance',
    tab: '加盟商提现',
  },
  {
    key: 'withdrawGroup',
    auth: 'withdrawGroup',
    tab: '团长提现',
  },
];

const WithdrawDetail = () => {
  const check = authCheck(tabList); // 检查权限
  console.log(check, 'check');

  const [tabkey, setTabKey] = useState(false); // tab分类

  // 检查权限获取key默认显示tab
  useEffect(() => {
    setTabKey(check && check.length ? check[0]['key'] : false);
  }, []);

  const contentList = {
    withdrawMerchant: <MerchantList></MerchantList>, // 单店卡豆提现
    withdrawMerchantCash: <MerchantListCash></MerchantListCash>, // 单店现金提现
    withdrawExpert: <ExpertUserList></ExpertUserList>, // 哒人提现
    withdrawAlliance: <AllianceTab></AllianceTab>, // 加盟商提现
    withdrawGroup: <WithdrawGroup></WithdrawGroup>, // 团长提现
  };

  return (
    <Card tabList={check} onTabChange={(key) => setTabKey(key)}>
      {check && check.length ? (
        contentList[tabkey]
      ) : (
        <Result status="403" title="403" subTitle="暂无权限"></Result>
      )}
    </Card>
  );
};

export default WithdrawDetail;
