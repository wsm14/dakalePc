import React from 'react';
import { connect } from 'umi';
import { SEX_TYPE } from '@/common/constant';
import { PHONE_PATTERN } from '@/common/regExp';
import FormCondition from '@/components/FormCondition';
import DescriptionsCondition from '@/components/DescriptionsCondition';

const ContactForm = (props) => {
  const { form, detail = {}, type } = props;

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
      render: (val) => ({ M: '男', F: '女' }[val]),
    },
    {
      label: '邮箱',
      name: 'email',
      rules: [{ required: false }],
    },
  ];

  const loadingInfo = [
    {
      title: '登录信息',
      label: '登录账号',
      name: 'account',
      normalize: (val) => val.replace(' ', ''),
    },
    {
      label: '登录密码',
      name: 'password',
      show: false,
      rules: [{ required: false }],
      placeholder: '不填写默认联系电话后6位',
    },
  ];

  return (
    <>
      {type != 'detail' ? (
        <FormCondition
          formItems={[...formItems, ...loadingInfo]}
          form={form}
          initialValues={detail}
        />
      ) : (
        // 详情返回
        <>
          <DescriptionsCondition
            title="联系人信息"
            formItems={formItems}
            initialValues={detail}
            style={{ marginTop: 24 }}
          ></DescriptionsCondition>
          <DescriptionsCondition
            title="登录信息"
            formItems={loadingInfo}
            initialValues={detail}
            style={{ marginTop: 24 }}
          ></DescriptionsCondition>
        </>
      )}
    </>
  );
};

export default connect(({}) => ({}))(ContactForm);
