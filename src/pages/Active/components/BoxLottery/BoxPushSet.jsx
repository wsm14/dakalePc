import React from 'react';
import FormCondition from '@/components/FormCondition';

const BoxPushSet = (props) => {
  const { form, initialValues } = props;

  const formItems = [
    {
      label: '物流公司',
      name: 'logisticsCompany',
    },
    {
      label: '物流单号',
      name: 'logisticsNum',
    },
    {
      label: '收货地址',
      type: 'noForm',
      name: 'contentParam',
      formItem: (
        <div style={{ marginLeft: 80, marginBottom: 10, display: 'flex', alignItems: 'center' }}>
          收货信息: <div style={{ marginLeft: '5px' }}>{initialValues?.contentParam}</div>
        </div>
      ),
    },
  ];

  return (
    <>
      <FormCondition form={form} formItems={formItems}></FormCondition>
    </>
  );
};

export default BoxPushSet;
