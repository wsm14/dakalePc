import React, { useState } from 'react';
import { Card } from 'antd';
import AllianceList from './AllianceList';

const tabList = [
  {
    key: 'city',
    tab: '市级提现',
  },
  {
    key: 'partner',
    tab: '区县提现',
  },
];

const AllianceTab = () => {
  const [tabkey, setTabKey] = useState('city');

  const listProps = { tabkey };

  const contentList = {
    city: <AllianceList {...listProps}></AllianceList>,
    partner: <AllianceList {...listProps}></AllianceList>,
  };

  return (
    <>
      <Card
        bordered={false}
        tabList={tabList}
        activeTabKey={tabkey}
        onTabChange={(key) => setTabKey(key)}
      >
        {contentList[tabkey]}
      </Card>
    </>
  );
};

export default AllianceTab;
