import React from 'react';
import { connect } from 'umi';
import { Button, Form, Timeline, Typography } from 'antd';
import FormCondition from '@/components/FormCondition';
import DescriptionsCondition from '@/components/DescriptionsCondition';
import DrawerCondition from '@/components/DrawerCondition';
const { Title } = Typography;

const Index = (props) => {
  const { visible = {}, onClose, loading } = props;
  const { show = fasle, detail = {} } = visible;

  const LogisticsItem = [
    {
      label: '运单号码 ',
      name: 'merchantName',
    },
    {
      label: '物流编号',
      name: 'merchantMobile',
    },
    {
      label: ' 物流公司',
      name: 'merchantProvince',
    },
    {
      label: '供应商名称',
      name: 'businessTime',
      span: 3,
    },
    {
      label: '发货地址',
      name: 'address',
      render: () => '单店',
      span: 3,
    },
    {
      label: '收货地址',
      name: 'address',
      render: () => '单店',
      span: 3,
    },
    {
      label: '发货人 ',
      name: 'merchantName',
      span: 1.5,
    },
    {
      label: '发货时间',
      name: 'merchantMobile',
      span: 1.5,
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
      <Title level={4}>已揽件，预计后天送达</Title>
      <Timeline>
        <Timeline.Item>Create a services site 2015-09-01</Timeline.Item>
        <Timeline.Item>Solve initial network problems 2015-09-01</Timeline.Item>
        <Timeline.Item>Technical testing 2015-09-01</Timeline.Item>
        <Timeline.Item color="red">Network problems being solved 2015-09-01</Timeline.Item>
      </Timeline>
      <DescriptionsCondition
        labelStyle={{ width: 120 }}
        formItems={LogisticsItem}
        column={3}
        initialValues={detail}
      ></DescriptionsCondition>
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['sysTradeList/fetchTradeAdd'],
}))(Index);
