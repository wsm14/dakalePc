import React from 'react';
import FormComponents from '@/components/FormCondition';

const TaskConfigFormSet = (props) => {
  const { form, detail, type } = props;

  const formItems = [
    {
      label: '任务名称',
      name: 'name',
      disabled: true,
      visible: type == 'edit',
    },
    {
      label: '获得金币数',
      name: 'coins',
      type: 'number',
      visible: type == 'edit',
    },
  ];

  return <FormComponents form={form} formItems={formItems} initialValues={detail}></FormComponents>;
};

export default TaskConfigFormSet;