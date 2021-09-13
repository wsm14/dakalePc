import React, { useRef, useState, useEffect } from 'react';
import { Card, Result } from 'antd';
import { authCheck } from '@/layouts/AuthConsumer';
import MerchantList from './components/Withdraw/MerchantList';
import ExpertUserList from './components/Withdraw/ExpertUserList';

const tabList = [
  {
    key: 'task',
    auth: 'task',
    tab: '单店提现',
  },
  {
    key: 'direct',
    auth: 'direct',
    tab: '哒人提现',
  },
];

const WithdrawDetail = () => {
  const check = authCheck(tabList); // 检查权限

  const childRef = useRef(); // 表格ref
  const [tabkey, setTabKey] = useState(false); // tab分类

  // 检查权限获取key默认显示tab
  useEffect(() => {
    setTabKey(check && check.length ? check[0]['key'] : false);
  }, []);

  // 表格公共props
  const tableProp = { childRef };

  const contentList = {
    task: <MerchantList {...tableProp}></MerchantList>, // 单店提现
    direct: <ExpertUserList {...tableProp}></ExpertUserList>, // 哒人提现
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
