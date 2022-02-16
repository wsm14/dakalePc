import React, { useState } from 'react';
import { SALE_ACCOUNT_TYPE, SEX_NEW_TYPE } from '@/common/constant';
import CITYJSON from '@/common/city';
import FormCondition from '@/components/FormCondition';

const SaleAccountSet = (props) => {
  const { form, detail, type } = props;
  // 选择框类型 判断所属地区可选项目
  const [agentType, setAgentType] = useState(undefined);

  const formItems = [
    {
      title: '基础信息',
      label: '类型',
      type: 'select',
      name: 'agentType',
      select: SALE_ACCOUNT_TYPE,
      onChange: (val) => {
        // 重置地区项目
        setAgentType(val);
        // 重置地区选项值
        form.setFieldsValue({ agentCode: undefined });
      },
      disabled: type === 'edit',
    },
    {
      label: '所属地区',
      name: 'agentCode',
      type: 'cascader',
      disabled: type === 'edit',
      select: {
        undefined: undefined,
        province: CITYJSON.map((item) => ({ label: item.label, value: item.value })),
        city: CITYJSON.map((item) => ({
          label: item.label,
          value: item.value,
          children: item.children.map((citem) => ({ ...citem, children: undefined })),
        })),
        district: undefined,
      }[agentType],
      onChange: (val, option) => form.setFieldsValue({ agentName: option[option.length - 1].label }),
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
      type: 'radio',
      select: SEX_NEW_TYPE,
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
      rules: [{ required: false }],
      placeholder: type == 'edit' ? '不填写则不修改' : '不填写默认联系电话后6位',
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
