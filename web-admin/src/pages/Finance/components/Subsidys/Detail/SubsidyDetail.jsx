import React from 'react';
import { SUBSIDY_BEAN_TYPE, SUBSIDY_ACTION_ROLE } from '@/common/constant';
import DescriptionsCondition from '@/components/DescriptionsCondition';

const SubsidyDetail = (props) => {
  const { detail = {} } = props;

  const formItems = [
    {
      label: '任务名称',
      name: 'taskName',
    },
    {
      label: '补贴类型',
      name: 'mode',
      render: (val) => SUBSIDY_BEAN_TYPE[val],
    },
    {
      label: '补贴角色',
      name: 'role',
      render: (val) => SUBSIDY_ACTION_ROLE[val],
    },
    {
      label: '总参与人数',
      name: 'participants',
    },
 
    {
      label: '总卡豆数',
      name: 'totalBeans',
    },
    {
      label: '凭证',
      name: 'certificate',
      type: 'upload',
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
