import React from 'react';
import FormCondition from '@/components/FormCondition';

const GameSignPushSet = (props) => {
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
      name: 'userAddressObject',
      formItem: (
        <div style={{ marginLeft: 80, marginBottom: 10, display: 'flex', alignItems: 'center' }}>
          <div style={{ width: 100 }}>收货信息:</div>{' '}
          <div style={{ marginLeft: '5px' }}>{initialValues?.userAddressObject}</div>
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

export default GameSignPushSet;
