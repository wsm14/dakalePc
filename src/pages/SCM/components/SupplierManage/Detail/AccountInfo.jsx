import React from 'react';
import { checkCityName } from '@/utils/utils';
import { SUPPLIER_AUTH_TYPE } from '@/common/constant';
import DescriptionsCondition from '@/components/DescriptionsCondition';

const AccountInfo = (props) => {
  const { detail } = props;

  const itemArr = [
    {
      label: '银行卡',
      name: ['ownerBankBindingInfo', 'type'],
      render: (val) => SUPPLIER_AUTH_TYPE[val],
    },
    {
      label: '银行卡号',
      name: ['ownerBankBindingInfo', 'type'],
    },
    {
      label: '开户支行',
      name: ['ownerBankBindingInfo', 'type'],
    },
    {
      label: '开户城市',
      name: ['ownerBankBindingInfo', 'classifyNames'],
    },
    {
      label: '银行预留手机号',
      name: ['ownerBankBindingInfo', 'districtCode'],
      render: (val) => checkCityName(val),
    },
    {
      label: '结算人身份证正面照',
      name: ['ownerBankBindingInfo', 'type'],
    },
    {
      label: '结算人身份证反面照',
      name: ['ownerBankBindingInfo', 'type'],
    },
    {
      label: '姓名',
      name: ['ownerBankBindingInfo', 'type'],
    },
    {
      label: '身份证号码',
      name: ['ownerBankBindingInfo', 'type'],
    },
    {
      label: '有效期',
      name: ['ownerBankBindingInfo', 'type'],
    },
    {
      label: '补充描述和凭证',
      name: ['ownerBankBindingInfo', 'type'],
    },
  ];

  return <DescriptionsCondition formItems={itemArr} initialValues={detail}></DescriptionsCondition>;
};

export default AccountInfo;
