import React, { useState } from 'react';
import { Card, Result } from 'antd';
import AuthConsumer, { authCheck } from '@/layouts/AuthConsumer';
import UserList from './components/Account/List/UserList';
import RoleList from './components/Account/List/RoleList';
import SectionList from './components/Account/List/SectionList';

const tabList = [
  {
    key: 'tab1',
    auth: 'user',
    tab: '用户',
  },
  {
    key: 'tab2',
    auth: 'role',
    tab: '角色',
  },
  {
    key: 'tab3',
    auth: 'section',
    tab: '部门',
  },
];

const AccountOwn = () => {
  const [tabkey, setTabKey] = useState('tab1');

  const contentList = {
    tab1: (
      <AuthConsumer
        auth="user"
        noAuth={<Result status="403" title="403" subTitle="暂无权限"></Result>}
      >
        <UserList></UserList>
      </AuthConsumer>
    ),
    tab2: (
      <AuthConsumer
        auth="role"
        noAuth={<Result status="403" title="403" subTitle="暂无权限"></Result>}
      >
        <RoleList></RoleList>
      </AuthConsumer>
    ),
    tab3: (
      <AuthConsumer
        auth="section"
        noAuth={<Result status="403" title="403" subTitle="暂无权限"></Result>}
      >
        <SectionList></SectionList>
      </AuthConsumer>
    ),
  };

  return (
    <Card
      bordered={false}
      tabList={authCheck(tabList)}
      activeTabKey={tabkey}
      onTabChange={(key) => {
        console.log(key);
        setTabKey(key);
      }}
    >
      {contentList[tabkey]}
    </Card>
  );
};

export default AccountOwn;
