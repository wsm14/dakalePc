import React from 'react';
import { SUBSIDY_TYPE, SUBSIDY_TASK_ROLE } from '@/common/constant';
import DescriptionsCondition from '@/components/DescriptionsCondition';

const SubsidyDetail = (props) => {
  const { detail } = props;

  const formItems = [
    {
      label: '任务名称',
      name: 'taskName',
    },
    {
      label: '补贴类型',
      name: 'type',
      render: (val) => SUBSIDY_TYPE[val],
    },
    {
      label: '补贴角色',
      name: 'role',
      render: (val) => SUBSIDY_TASK_ROLE[val],
    },
    {
      label: '总参与人数',
      name: 'participants',
    },
    {
      label: '已补贴卡豆数',
      name: 'subsidizedBeans',
    },
    {
      label: '充值卡豆数',
      name: 'rechargeBeans',
    },
    {
      label: '状态',
      name: 'status',
      render: (val) => ['停用', '启用'][val],
    },
  ];

  return (
    <DescriptionsCondition formItems={formItems} initialValues={detail}></DescriptionsCondition>
  );
};

export default SubsidyDetail;
