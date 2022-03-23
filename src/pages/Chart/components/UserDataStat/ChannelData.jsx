import React from 'react';
import { Tabs } from 'antd';
import ChannelDataStat from './components/ChannelData/ChannelDataStat';
import ChannelDataContrast from './components/ChannelData/ChannelDataContrast';

const { TabPane } = Tabs;

const ChannelData = () => {
  const radioGroupTypeList = [
    {
      key: '1',
      tab: '渠道统计',
      content: <ChannelDataStat></ChannelDataStat>,
    },
    {
      key: '2',
      tab: '渠道趋势',
      content: <ChannelDataContrast></ChannelDataContrast>,
    },
  ];

  return (
    <div>
      <Tabs defaultActiveKey="1" onChange={() => console.log(1)}>
        {radioGroupTypeList.map((item) => (
          <TabPane tab={item.tab} key={item.key}>
            {item.content}
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
};

export default ChannelData;
