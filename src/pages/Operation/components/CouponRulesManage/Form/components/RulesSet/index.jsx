import React from 'react';
import categoryRule from './CategoryRule';
import merchantRule from './MerchantRule';

export default (props) => {
  const { ruleShowApi } = props;
  const ShowDom = {
    categoryRule,
    merchantRule,
  }[ruleShowApi];

  if (!ShowDom) return null;

  return <ShowDom {...props}></ShowDom>;
};
