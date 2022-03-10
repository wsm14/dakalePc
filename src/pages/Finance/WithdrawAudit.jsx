import React, { useState } from 'react';
import { Card } from 'antd';
import WchatCommunityList from './components/WithdrawAudit/WchatCommunityList';

const tabList = [
  {
    key: 'wchatCommunity',
    tab: '哒小团',
  },
];

const WithdrawDetail = () => {
  const [tabkey, setTabKey] = useState("wchatCommunity"); // tab分类

  const contentList = {
    wchatCommunity: <WchatCommunityList></WchatCommunityList>, // 哒小团
  };

  return (
    <Card tabList={tabList} onTabChange={(key) => setTabKey(key)}>
      {contentList[tabkey]}
    </Card>
  );
};

export default WithdrawDetail;
