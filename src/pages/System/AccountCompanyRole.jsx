import React, { useState } from 'react';
import { Card } from 'antd';
import UserList from './components/Company/List/UserList';
import RoleList from './components/Company/List/RoleList';

const tabList = [
  {
    key: 'tab1',
    tab: '用户',
  },
  {
    key: 'tab2',
    tab: '角色',
  },
];

const CompanyAccount = (props) => {
  const [tabkey, setTabKey] = useState('tab1');

  const contentList = {
    tab1: <UserList></UserList>,
    tab2: <RoleList></RoleList>,
  };

  return (
    <Card
      bordered={false}
      tabList={tabList}
      activeTabKey={tabkey}
      onTabChange={(key) => setTabKey(key)}
    >
      {contentList[tabkey]}
    </Card>
  );
};

export default CompanyAccount;
