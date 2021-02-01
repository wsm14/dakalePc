import React from 'react';
import { SALE_ACCOUNT_TYPE } from '@/common/constant';
import FormCondition from '@/components/FormCondition';

const SaleAccountSet = (props) => {
  const { form, detail, type } = props;

  const formItems = [
    {
      title: '基础信息',
      label: '类型',
      type: 'select',
      name: 'agentType',
      select: Object.keys(SALE_ACCOUNT_TYPE).map((item) => ({
        name: SALE_ACCOUNT_TYPE[item],
        value: item,
      })),
      onChange: (val, item) => form.setFieldsValue({ category: item.children[0] }),
    },
    {
      label: '所属地区',
      name: 'agentCode',
    },
    {
      label: '所属地区',
      name: 'agentName',
      hidden: true,
    },
    {
      title: '联系人账号',
      label: '联系人姓名',
      name: 'sellMainName',
    },
    {
      label: '联系人性别',
      name: 'gender',
    },
    {
      label: '联系人电话',
      name: 'contactMobile',
      rules: [{ required: false }],
    },
    {
      label: `登录账号`,
      name: 'sellMainMobile',
      disabled: type === 'edit',
    },
    {
      label: '登录密码',
      name: 'password',
    },
    {
      label: '联系人邮箱',
      name: 'email',
      rules: [{ required: false }],
    },
  ];

  return <FormCondition form={form} formItems={formItems} initialValues={detail}></FormCondition>;
};

export default SaleAccountSet;
