import React from 'react';
import FormCondition from '@/components/FormCondition';

const BusinessEditVoiceInfo = (props) => {
  const { initialValues = {}, form } = props;

  const formItems = [
    {
      title: '04 语音播报信息',
      label: '阿里云productKey',
      name: 'iotProductKey',
      rules: [{ required: false }],
    },
    {
      label: '阿里云deviceName',
      name: 'iotDeviceName',
      rules: [{ required: false }],
    },
  ];

  return <FormCondition formItems={formItems} initialValues={initialValues} form={form} />;
};

export default BusinessEditVoiceInfo;
