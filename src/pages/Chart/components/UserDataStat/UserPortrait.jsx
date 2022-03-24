import React from 'react';
import { Tabs } from 'antd';
import GenderAgeDistribution from './components/UserPortrait/GenderAgeDistribution';
import DistrictDistribution from './components/UserPortrait/DistrictDistribution';
import TerminalDistribution from './components/UserPortrait/TerminalDistribution';

const { TabPane } = Tabs;

const UserPortrait = () => {
  const radioGroupTypeList = [
    {
      key: '1',
      tab: '性别及年龄分布',
      content: <GenderAgeDistribution></GenderAgeDistribution>,
    },
    {
      key: '2',
      tab: '地区分布',
      content: <DistrictDistribution></DistrictDistribution>,
    },
    // {
    //   key: '3',
    //   tab: '终端及机型分布',
    //   content: <TerminalDistribution></TerminalDistribution>,
    // },
  ];

  return (
    <div>
      <Tabs defaultActiveKey="1" onChange={() => console.log(1)} destroyInactiveTabPane={true}>
        {radioGroupTypeList.map((item) => (
          <TabPane tab={item.tab} key={item.key}>
            {item.content}
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
};

export default UserPortrait;
