import React from 'react';
import { connect } from 'umi';
import { Button, Form, Timeline, Typography } from 'antd';
import FormCondition from '@/components/FormCondition';
import DescriptionsCondition from '@/components/DescriptionsCondition';
import DrawerCondition from '@/components/DrawerCondition';
import { checkCityName } from '@/utils/utils';
const { Title } = Typography;

const Index = (props) => {
  const { visible = {}, onClose, loading } = props;
  const { show = fasle, detail = {} } = visible;
  const { statusInfoList = [] } = detail; //快递状态信息

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
      name: 'orderLogisticInfo',
      render: (val) => {
        const { districtCode, address, mobile, addressName } = val;
        return `${checkCityName(districtCode)}${address}  ${addressName}  ${mobile}`;
      },
      span: 2,
    },
  ];

  // 弹出窗属性
  const modalProps = {
    title: `查看物流`,
    width: 800,
    visible: show,
    onClose,
  };
  return (
    <DrawerCondition {...modalProps}>
      <Title level={4}>
        {
          ['快递收件(揽件)', '在途中', '正在派件', '已签收', '派送失败', '疑难件', '退件签收'][
            detail.deliveryStatus
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
        initialValues={detail}
      ></DescriptionsCondition>
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['sysTradeList/fetchTradeAdd'],
}))(Index);
