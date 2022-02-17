import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
import MerchantTab from './components/Withdraw/MerchantTab';

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
    merchantTab: <MerchantTab {...listProps}></MerchantTab>,
    agencyTab: <MerchantTab {...listProps}></MerchantTab>,
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
