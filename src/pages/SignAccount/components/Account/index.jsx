import React, { useState, } from 'react';
import { Card } from 'antd';
import UserList from './components/List/UserList';
import RoleList from './components/List/RoleList';
import SectionList from './components/List/SectionList';

const tabList = [
  {
    key: 'tab1',
    tab: '用户',
  },
  {
    key: 'tab2',
    tab: '角色',
  },
  {
    key: 'tab3',
    tab: '部门',
  },
];

const PublicAuditList = (props) => {
  const [tabkey, setTabKey] = useState('tab1');

  const contentList = {
    tab1: <UserList></UserList>,
    tab2: <RoleList></RoleList>,
    tab3: <SectionList></SectionList>,
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

export default PublicAuditList;
