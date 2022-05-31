import React from 'react';
import { connect } from 'umi';
import { BUS_BANKACCOUNT_TYPE } from '@/common/constant';
import MapSelectAddress from '@/components/MapSelectAddress';
import FormCondition from '@/components/FormCondition';

const BaseInfoForm = (props) => {
  const { classifyParentList, form, initialValues, setBankAccount } = props;

  const formItems = [
    {
      title: '01 基础信息',
      label: '供应商类型',
      name: 'type',
      type: 'radio',
      select: BUS_BANKACCOUNT_TYPE,
      disabled: initialValues.bankStatus === '2',
      onChange: (e) => setBankAccount(e.target.value),
    },
    {
      label: '供应商名称',
      name: 'name',
    },
    {
      label: '主营类目',
      name: 'classifyIds',
      type: 'select',
      mode: 'multiple',
      select: classifyParentList,
      fieldNames: { label: 'classifyName', value: 'classifyId' },
    },
  ];

  return (
    <>
      <FormCondition formItems={formItems} form={form} />
      <MapSelectAddress form={form} initialValues={initialValues}></MapSelectAddress>
    </>
  );
};

export default connect(({ baseData }) => ({
  classifyParentList: baseData.classifyParentList,
}))(BaseInfoForm);
