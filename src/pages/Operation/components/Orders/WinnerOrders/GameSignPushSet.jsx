import React from 'react';
import { connect } from 'umi';
import FormCondition from '@/components/FormCondition';

const GameSignPushSet = (props) => {
  const { form, initialValues, companyList } = props;

  const formItems = [
    {
      label: '物流公司',
      name: 'companyCode',
      type: 'select',
      select: companyList,
      fieldNames: { label: 'companyName', value: 'companyCode' },
      onSelect: (val, option) => {
        option &&
          form.setFieldsValue({
            logisticsCompany: option.option.companyName,
          });
      },
    },
    {
      label: '物流公司名称',
      name: 'logisticsCompany',
      hidden: true,
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

export default connect(({ baseData }) => ({
  companyList: baseData.companyList,
}))(GameSignPushSet);
