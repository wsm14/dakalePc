import React from 'react';
import DescriptionsCondition from '@/components/DescriptionsCondition';

const IntelligenceInfo = (props) => {
  const { detail } = props;

  const itemArr = [
    {
      label: '营业执照',
      type: 'upload',
      name: ['proofInfoObject', 'businessLicenseImg'],
    },
    {
      label: '公司名称',
      name: ['proofInfoObject', 'businessName'],
    },
    {
      label: '统一社会信用代码',
      name: ['proofInfoObject', 'socialCreditCode'],
    },
    {
      label: '注册地址',
      name: ['proofInfoObject', 'signInAddress'],
    },
    {
      label: '营业期限',
      name: ['proofInfoObject', 'establishDate'],
    },
    {
      label: '经营范围',
      name: ['proofInfoObject', 'businessScope'],
    },
    {
      label: '生产/经营许可证',
      type: 'upload',
      name: ['proofInfoObject', 'productLicense'],
    },
    {
      label: '体系认证',
      type: 'upload',
      name: ['proofInfoObject', 'systemApprove'],
    },
    {
      label: '产品认证',
      type: 'upload',
      name: ['proofInfoObject', 'productApprove'],
    },
    {
      label: '授权证书',
      type: 'upload',
      name: ['proofInfoObject', 'authorizeImg'],
    },
  ];

  return <DescriptionsCondition formItems={itemArr} initialValues={detail}></DescriptionsCondition>;
};

export default IntelligenceInfo;
