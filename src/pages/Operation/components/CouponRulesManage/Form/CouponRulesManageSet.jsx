import React, { useState } from 'react';
import { CONPON_RULES_TYPE } from '@/common/constant';
import FormCondition from '@/components/FormCondition';
import RulesSet from './components/RulesSet';

const CouponRulesManageSet = (props) => {
  const { form, initialValues, type } = props;

  const [ruleShowApi, setRuleShowApi] = useState(false); // 规则类型

  // 信息
  const formItems = [
    {
      label: '规则类型',
      name: 'ruleType',
      type: 'select',
      select: CONPON_RULES_TYPE,
      onChange: (val) => {
        setRuleShowApi(val);
        form.setFieldsValue({
          ruleConditions: [],
        });
      },
    },
    {
      label: '规则名称',
      name: 'ruleName',
      maxLength: 50,
    },
    {
      type: 'noForm',
      formItem: (
        <RulesSet
          type={type}
          detail={initialValues}
          form={form}
          ruleShowApi={ruleShowApi}
        ></RulesSet>
      ),
    },
  ];

  return (
    <FormCondition form={form} formItems={formItems} initialValues={initialValues}></FormCondition>
  );
};

export default CouponRulesManageSet;
