import React from 'react';
import DescriptionsCondition from '@/components/DescriptionsCondition';

const TaskConfigDetail = (props) => {
  const { detail } = props;

  const formItems = [
    {
      label: '任务名称',
      name: 'name',
    },
    {
      label: '获得金币数',
      name: 'jinbi',
    },
  ];

  return (
    <DescriptionsCondition formItems={formItems} initialValues={detail}></DescriptionsCondition>
  );
};

export default TaskConfigDetail;
