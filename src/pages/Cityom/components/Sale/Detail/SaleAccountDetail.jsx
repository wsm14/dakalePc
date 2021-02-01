import React from 'react';
import { SALE_ACCOUNT_TYPE, SEX_NEW_TYPE } from '@/common/constant';
import DescriptionsCondition from '@/components/DescriptionsCondition';

const SaleAccountDetail = (props) => {
  const { detail } = props;

  const formItems = [
    {
      title: '基础信息',
      label: '类型',
      name: 'agentType',
      render: (val) => SALE_ACCOUNT_TYPE[val],
    },
    {
      label: '所属地区',
      name: 'agentName',
    },
    {
      title: '联系人账号',
      label: '联系人姓名',
      name: 'adminName',
    },
    {
      label: '联系人性别',
      name: 'gender',
      render: (val) => SEX_NEW_TYPE[val],
    },
    {
      label: '联系人电话',
      name: 'contactMobile',
    },
    {
      label: '登录账号',
      name: 'sellMainMobile',
    },
    {
      label: '联系人邮箱',
      name: 'email',
    },
  ];

  return (
    <DescriptionsCondition formItems={formItems} initialValues={detail}></DescriptionsCondition>
  );
};

export default SaleAccountDetail;
