import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { Card } from 'antd';

import BodyList from './components/PointManage/List/BodyList';
import PointList from './components/PointManage/List/PointList';
const tabList = [
  {
    key: '0',
    tab: '打卡主体',
  },
  {
    key: '1',
    tab: '打卡点位',
  },
];

const PointManage = (props) => {
  const [tabKey, setTabKey] = useState('0');
  const listProps = { tabKey };

  const contentList = {
    0: <BodyList {...listProps}></BodyList>,
    1: <PointList {...listProps}></PointList>,
  };

  return (
    <Card tabList={tabList} activeTabKey={tabKey} onTabChange={(key) => setTabKey(key)}>
      {contentList[tabKey]}
    </Card>
  );
};

export default connect(({ pointManage, loading }) => ({
  pointManageList: pointManage.list,
  loading: loading.effects['pointManage/fetchGetList'],
}))(PointManage);
