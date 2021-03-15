import React, { useState } from 'react';
import { connect } from 'umi';
import DescriptionsCondition from '@/components/DescriptionsCondition';
import DrawerCondition from '@/components/DrawerCondition';

const SubsidyDetail = (props) => {
  const { dispatch, onClose, visible } = props;

  const { type, show = false, info } = visible;

  const formItems = [
    {
      label: '任务名称',
      name: 'taskName',
    },
    {
      label: '补贴类型',
      name: 'type',
      render: (val) => ({ behavior: '行为补贴', platform: '平台直充' }[val]),
    },
    {
      label: '补贴角色',
      name: 'subsidyRole',
      render: (val) => ({ user: '用户', merchant: '商家', kol: '哒人' }[val]),
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

  const modalProps = {
    title: '查看详情',
    visible: show,
    onClose,
  };

  return (
    <DrawerCondition {...modalProps}>
      <DescriptionsCondition formItems={formItems} initialValues={info}></DescriptionsCondition>
    </DrawerCondition>
  );
};
export default SubsidyDetail;
