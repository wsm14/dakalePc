import React from 'react';
import FormCondition from '@/components/FormCondition';

const SupplierBrandForm = (props) => {
  const { form, initialValues = {} } = props;

  const formItems = [
    {
      label: '品牌名称',
      name: 'brandName',
    },
    {
      label: '授权单位',
      name: 'authorizeCompany',
    },
    {
      label: '授权期限',
      name: 'timeData',
      type: 'rangePicker',
    },
    {
      label: '授权证书',
      name: 'authorizeImg',
      type: 'upload',
      multiple: true,
      isCut: false,
    },
  ];

  return (
    <FormCondition form={form} formItems={formItems} initialValues={initialValues}></FormCondition>
  );
};

export default SupplierBrandForm;
