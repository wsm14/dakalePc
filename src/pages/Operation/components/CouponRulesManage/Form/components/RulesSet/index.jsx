import React from 'react';
import categoryRule from './CategoryRule';
import merchantRule from './MerchantRule';
import goodsRule from './goodsRule/ShareCoupon/ShareCoupon';

export default (props) => {
  const { ruleShowApi } = props;
  const ShowDom = {
    categoryRule,
    merchantRule,
    goodsRule,
  }[ruleShowApi];

  if (!ShowDom) return null;

  return <ShowDom {...props}></ShowDom>;
};
