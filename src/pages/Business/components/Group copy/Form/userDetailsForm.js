import React from 'react';
import FormCondition from '@/components/FormCondition';
import { SEX_NEW_TYPE } from '@/common/constant';
import { connect } from 'umi';

const userForm = (props) => {
  const { form, initialValues, groupDetails } = props;

  const formItems = [
    {
      label: '联系人姓名',
      name: 'contactPerson',
    },
    {
      label: '性别',
      name: 'gender',
      type: 'radio',
      visible: Object.keys(groupDetails).length !== 0 ? false : true,
      select: SEX_NEW_TYPE,
    },
    {
      label: '联系人电话',
      name: 'contactMobile',
    },
  ];

  return <FormCondition formItems={formItems} form={form} initialValues={initialValues} />;
};

export default connect(({ groupSet }) => ({
  ...groupSet,
}))(userForm);
