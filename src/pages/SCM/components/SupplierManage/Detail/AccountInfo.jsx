import React from 'react';
import { checkCityName } from '@/utils/utils';
import DescriptionsCondition from '@/components/DescriptionsCondition';

const AccountInfo = (props) => {
  const { detail } = props;

  const itemArr = [
    {
      label: '银行卡',
      name: ['ownerBankBindingInfo', 'bankType'],
    },
    {
      label: '银行卡号',
      name: ['ownerBankBindingInfo', 'bankNumber'],
    },
    {
      label: '开户支行',
      name: ['ownerBankBindingInfo', 'bankName'],
    },
    {
      label: '开户城市',
      name: ['ownerBankBindingInfo', 'bankBindingInfoObject', 'areaCode'],
      render: (val) => checkCityName(val),
    },
    {
      label: '银行预留手机号',
      name: ['ownerBankBindingInfo', 'bankBindingInfoObject', 'legalMp'],
    },
    {
      label: '结算人身份证正面照',
      type: 'upload',
      name: ['ownerBankBindingInfo', 'bankBindingInfoObject', 'certFrontPhoto'],
    },
    {
      label: '结算人身份证反面照',
      type: 'upload',
      name: ['ownerBankBindingInfo', 'bankBindingInfoObject', 'certReversePhoto'],
    },
    {
      label: '姓名',
      name: ['ownerBankBindingInfo', 'bankBindingInfoObject', 'legalPerson'],
    },
    {
      label: '身份证号码',
      name: ['ownerBankBindingInfo', 'bankBindingInfoObject', 'legalCertId'],
    },
    {
      label: '有效期',
      name: ['ownerBankBindingInfo', 'bankBindingInfoObject', 'legalCertIdExpires'],
    },
    {
      label: '补充描述',
      name: ['ownerBankBindingInfo', 'bankBindingInfoObject', 'additionalDesc'],
    },
    {
      label: '凭证',
      type: 'upload',
      name: ['ownerBankBindingInfo', 'bankBindingInfoObject', 'additionalVoucher'],
    },
  ];

  return <DescriptionsCondition formItems={itemArr} initialValues={detail}></DescriptionsCondition>;
};

export default AccountInfo;
