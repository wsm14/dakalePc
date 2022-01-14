import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { CONPON_RULES_TYPE } from '@/common/constant';
import FormCondition from '@/components/FormCondition';
import RulesSet from './components/RulesSet';

const CouponRulesManageSet = (props) => {
  const { form, initialValues } = props;

  const [ruleShowApi, setRuleShowApi] = useState(false); // 规则类型

  // 信息
  const formItems = [
    {
      label: '规则类型',
      name: 'classType',
      type: 'select',
      select: CONPON_RULES_TYPE,
      onChange: (val) => {
        setRuleShowApi(val);
      },
    },
    {
      label: '规则名称',
      name: 'total',
      maxLength: 50,
    },
    {
      type: 'noForm',
      formItem: <RulesSet form={form} ruleShowApi={ruleShowApi}></RulesSet>,
    },
  ];

  return (
    <>
      <FormCondition
        form={form}
        formItems={formItems}
        initialValues={initialValues}
      ></FormCondition>
    </>
  );
};

export default connect(({}) => ({}))(CouponRulesManageSet);
