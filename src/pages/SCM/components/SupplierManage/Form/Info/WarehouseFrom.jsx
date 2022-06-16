import React from 'react';
import FormCondition from '@/components/FormCondition';
import WarehouseFormList from '../WarehouseFormList';

/**
 * 仓库信息
 */
const WarehouseFrom = ({ form, initialValues }) => {
  const formItems = [
    {
      title: '05 仓库信息',
      type: 'noForm',
      formItem: <WarehouseFormList form={form}></WarehouseFormList>,
    },
  ];

  return <FormCondition formItems={formItems} form={form} initialValues={initialValues} />;
};

export default WarehouseFrom;
