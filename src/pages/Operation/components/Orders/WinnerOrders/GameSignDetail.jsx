import React from 'react';
import { Timeline, Typography } from 'antd';
import { checkCityName } from '@/utils/utils';
import DescriptionsCondition from '@/components/DescriptionsCondition';

const { Title } = Typography;

const GameSignDetail = (props) => {
  const { initialValues } = props;
  const { statusInfoList = [] } = initialValues; //快递状态信息

  const LogisticsItem = [
    {
      label: '物流编号',
      name: 'number',
      span: 1,
    },
    {
      label: '物流公司',
      name: 'expName',
      span: 1,
    },
    {
      label: '收货地址',
      name: 'userAddressObject',
      span: 2,
    },
  ];

  return (
    <>
      <Title level={4}>
        {
          ['快递收件(揽件)', '在途中', '正在派件', '已签收', '派送失败', '疑难件', '退件签收'][
            initialValues.deliveryStatus
          ]
        }
      </Title>
      <Timeline>
        {statusInfoList.map((item, index) => (
          <Timeline.Item
            key={index + 1}
            color={index === statusInfoList.length - 1 ? 'red' : 'blue'}
          >
            <span style={{ marginRight: 20 }}>{item.time}</span>
            <span>{item.status}</span>
          </Timeline.Item>
        ))}
      </Timeline>
      <DescriptionsCondition
        labelStyle={{ width: 120 }}
        formItems={LogisticsItem}
        column={2}
        initialValues={initialValues}
      ></DescriptionsCondition>
    </>
  );
};

export default GameSignDetail;
