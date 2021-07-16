import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Card, Button } from 'antd';
import TableDataBlock from '@/components/TableDataBlock';
import UserCode from './components/MaterialConfig/UserCode';
import MerchantCode from './components/MaterialConfig/MerchantCode';

const tabList = [
  {
    key: 'user',
    tab: '用户码',
  },
  {
    key: 'merchant',
    tab: '商家码',
  },
];

const MaterialConfig = (props) => {
  const [tabKey, setTabKey] = useState('user');
  const listProps = { tabKey };

  const contentList = {
    user: <UserCode {...listProps}></UserCode>,
    merchant: <MerchantCode {...listProps}></MerchantCode>,
  };

  const btnList = [
    {
      auth: 'downloadRecord',
      text: '下载记录',
    },
  ];

  return (
    <Card
      tabList={tabList}
      extra={<Button type="primary">下载记录</Button>}
      activeTabKey={tabKey}
      onTabChange={(key) => setTabKey(key)}
    >
      {contentList[tabKey]}
    </Card>
  );
};
export default connect()(MaterialConfig);
