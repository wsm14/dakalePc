import React from 'react';
import { Timeline } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import DescriptionsCondition from '@/components/DescriptionsCondition';

const ExpertUserLog = (props) => {
  const { visible, onClose } = props;
  const { show = false, detail = {} } = visible;

  const { row, data = [] } = detail;
  console.log(detail);
  const formItems = [
    {
      label: '哒人昵称',
      name: 'username',
    },
    {
      label: '哒人级别',
      name: 'level',
    },
    {
      label: '豆号',
      name: 'beanCode',
    },
  ];

  const modalProps = {
    title: `操作日志`,
    visible: show,
    onClose,
  };

  return (
    <DrawerCondition {...modalProps}>
      <DescriptionsCondition
        formItems={formItems}
        initialValues={row}
        style={{ marginBottom: 24 }}
      ></DescriptionsCondition>
      <Timeline>
        {data.map((item) => (
          <Timeline.Item key={item.logRecordId}>
            <p style={{ margin: 0, fontWeight: 500 }}>{item.createTime}</p>
            <p style={{ margin: 0 }}>{item.content}</p>
            <p style={{ margin: 0, color: '#999999' }}> 操作人：{item.operator}</p>
          </Timeline.Item>
        ))}
      </Timeline>
    </DrawerCondition>
  );
};
export default ExpertUserLog;
