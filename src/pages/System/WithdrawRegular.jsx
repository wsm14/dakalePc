import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
import MerchantTab from './components/Withdraw/MerchantTab';
import AgencyTab from './components/Withdraw/AgencyTab';

const tabList = [
  {
    key: 'merchant',
    tab: '店铺',
  },
  {
    key: 'province,city,partner',
    tab: '代理商',
  },
];

const WithdrawRegular = () => {
  const [tabkey, setTabKey] = useState('merchant');

  const listProps = { tabkey };

  const contentList = {
    merchant: <MerchantTab {...listProps}></MerchantTab>,
    'province,city,partner': <AgencyTab {...listProps}></AgencyTab>,
  };

  return (
    <>
      <Card tabList={tabList} activeTabKey={tabkey} onTabChange={(key) => setTabKey(key)}>
        {contentList[tabkey]}
      </Card>
    </>
  );
};
export default WithdrawRegular;
