import React from 'react';
import { checkCityName } from '@/utils/utils';
import { SUPPLIER_AUTH_TYPE } from '@/common/constant';
import DescriptionsCondition from '@/components/DescriptionsCondition';

const AccountInfo = (props) => {
  const { detail } = props;

  const itemArr = [
    {
      label: '银行卡',
      name: ['supplierObject', 'type'],
      render: (val) => SUPPLIER_AUTH_TYPE[val],
    },
    {
      label: '银行卡号',
      name: 'supplierName',
    },
    {
      label: '开户支行',
      name: 'identifyId',
    },
    {
      label: '开户城市',
      name: ['supplierObject', 'classifyNames'],
    },
    {
      label: '银行预留手机号',
      name: ['supplierObject', 'districtCode'],
      render: (val) => checkCityName(val),
    },
    {
      label: '结算人身份证正面照',
      name: 'createTime',
    },
    {
      label: '结算人身份证反面照',
      name: 'createTime',
    },
    {
      label: '姓名',
      name: 'createTime',
    },
    {
      label: '身份证号码',
      name: 'createTime',
    },
    {
      label: '有效期',
      name: 'createTime',
    },
    {
      label: '补充描述和凭证',
      name: 'createTime',
    },
  ];

  return <DescriptionsCondition formItems={itemArr} initialValues={detail}></DescriptionsCondition>;
};

export default AccountInfo;
