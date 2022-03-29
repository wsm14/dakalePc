import React from 'react';
import { Tabs } from 'antd';
import BehaviorContent from './components/UsageAnalysis/BehaviorContent';

const { TabPane } = Tabs;

const UsageAnalysis = () => {
  const radioGroupTypeList = [
    {
      key: '1',
      tab: '行为分析',
      content: <BehaviorContent></BehaviorContent>,
    },
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

export default UsageAnalysis;
