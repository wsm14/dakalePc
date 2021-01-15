import React from 'react';
import { SUBSIDY_ROLE } from '@/common/constant';
import FormCondition from '@/components/FormCondition';

const SubsidyDirectMoney = (props) => {
  const { form, detail } = props;

  const formItems = [
    {
      label: '任务名称',
      name: 'taskName',
    },
    {
      label: '补贴角色',
      name: 'role',
      type: 'select',
      select: Object.keys(SUBSIDY_ROLE).map((item) => ({ name: SUBSIDY_ROLE[item], value: item })),
    },
    {
      label: '充值卡豆数',
      name: 'rechargeBeans',
      type: 'number',
      precision: 0,
      min: 0,
      max: 999999999,
    },
  ];

  return <FormCondition form={form} formItems={formItems} initialValues={detail}></FormCondition>;
};

export default SubsidyDirectMoney;
