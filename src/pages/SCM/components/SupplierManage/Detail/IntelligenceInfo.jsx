import React from 'react';
import DescriptionsCondition from '@/components/DescriptionsCondition';

const IntelligenceInfo = (props) => {
  const { detail } = props;

  const itemArr = [
    {
      label: '营业执照',
      type: 'upload',
      name: ['supplierObject', 'proofInfoObject', 'businessLicenseImg'],
    },
    {
      label: '公司名称',
      name: ['supplierObject', 'proofInfoObject', 'businessName'],
    },
    {
      label: '统一社会信用代码',
      name: ['supplierObject', 'proofInfoObject', 'socialCreditCode'],
    },
    {
      label: '注册地址',
      name: ['supplierObject', 'proofInfoObject', 'signInAddress'],
    },
    {
      label: '营业期限',
      name: ['supplierObject', 'proofInfoObject', 'establishDate'],
    },
    {
      label: '经营范围',
      name: ['supplierObject', 'proofInfoObject', 'businessScope'],
    },
    {
      label: '生产/经营许可证',
      type: 'upload',
      name: ['supplierObject', 'proofInfoObject', 'productLicense'],
    },
    {
      label: '体系认证',
      type: 'upload',
      name: ['supplierObject', 'proofInfoObject', 'systemApprove'],
    },
    {
      label: '产品认证',
      type: 'upload',
      name: ['supplierObject', 'proofInfoObject', 'productApprove'],
    },
    {
      label: '授权证书',
      type: 'upload',
      name: ['supplierObject', 'proofInfoObject', 'authorizeImg'],
    },
  ];

  return <DescriptionsCondition formItems={itemArr} initialValues={detail}></DescriptionsCondition>;
};

export default IntelligenceInfo;
