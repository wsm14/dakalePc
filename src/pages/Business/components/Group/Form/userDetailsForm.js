import React from 'react';
import FormCondition from '@/components/FormCondition';
import { PHONE_PATTERN } from '@/common/regExp';
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
      addRules: [{ pattern: PHONE_PATTERN, message: '手机号格式不正确' }],
    },
  ];

  return <FormCondition formItems={formItems} form={form} initialValues={initialValues} />;
};

export default connect(({ groupSet }) => ({
  ...groupSet,
}))(userForm);
