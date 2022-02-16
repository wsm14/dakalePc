import React from 'react';
import DescriptionsCondition from '@/components/DescriptionsCondition';

const UserRealDetail = (props) => {
  const { detail = {} } = props;

  const formItems = [
    { label: '人脸识别照片', name: 'idCardImg', type: 'upload' },
    { label: '姓名', name: 'realName' },
    { label: '身份证号', name: 'cardNumber' },
    { label: '绑定银行', name: 'bankName' },
    { label: '绑定银行卡号', name: 'bankNumber' },
  ];

  return (
    <DescriptionsCondition formItems={formItems} initialValues={detail}></DescriptionsCondition>
  );
};

export default UserRealDetail;
