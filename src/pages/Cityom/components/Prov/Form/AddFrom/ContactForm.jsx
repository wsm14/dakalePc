import React from 'react';
import { connect } from 'umi';
import { SEX_TYPE } from '@/common/constant';
import { PHONE_PATTERN } from '@/common/regExp';
import FormCondition from '@/components/FormCondition';

const ContactForm = (props) => {
  const { form, initialValues = {} } = props;

  const formItems = [
    {
      title: '联系人信息',
      label: '联系人姓名',
      name: 'contactPerson',
    },
    {
      label: '联系人电话',
      name: 'contactMobile',
      maxLength: 11,
      addRules: [{ pattern: PHONE_PATTERN, message: '手机号格式不正确' }],
    },
    {
      label: '性别',
      type: 'radio',
      name: 'gender',
      select: SEX_TYPE,
    },
    {
      label: '邮箱',
      name: 'email',
      rules: [{ required: false }],
    },
    {
      title: '登录信息',
      label: '登录账号',
      name: 'account',
      normalize: (val) => val.replace(' ',''),
    },
    {
      label: '登录密码',
      name: 'password',
      rules: [{ required: false }],
      placeholder: '不填写默认联系电话后6位',
    },
  ];

  return <FormCondition formItems={formItems} form={form} initialValues={initialValues} />;
};

export default connect(({}) => ({}))(ContactForm);
