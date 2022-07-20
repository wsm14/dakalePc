import React from 'react';
import FormComponents from '@/components/FormCondition';

const TaskConfigFormSet = (props) => {
  const { form, detail } = props;

  const formItems = [
    {
      label: '活动名称',
      name: 'name',
      maxLength: '15',
    },
  ];

  return <FormComponents form={form} formItems={formItems} initialValues={detail}></FormComponents>;
};

export default TaskConfigFormSet;
