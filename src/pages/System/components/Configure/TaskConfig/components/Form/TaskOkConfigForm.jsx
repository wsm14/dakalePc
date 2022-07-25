import React from 'react';
import FormComponents from '@/components/FormCondition';

const TaskOkConfigForm = (props) => {
  const { form, detail, type } = props;

  const formItems = [
    {
      label: '获得卡豆数',
      name: 'bean',
    },
    {
      label: '获得金币数',
      name: 'coins',
    },
  ];

  return <FormComponents form={form} formItems={formItems} initialValues={detail}></FormComponents>;
};

export default TaskOkConfigForm;
