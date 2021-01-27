import React from 'react';
import DescriptionsCondition from '@/components/DescriptionsCondition';

const UserRealDetail = (props) => {
  const { detail = {} } = props;

  const formItems = [
    { label: '身份证正面照', name: 'idCardImg', type: 'upload' },
    { label: '姓名', name: 'realName' },
    { label: '身份证号', name: 'cardNumber' },
  ];

  return (
    <DescriptionsCondition formItems={formItems} initialValues={detail}></DescriptionsCondition>
  );
};

export default UserRealDetail;
