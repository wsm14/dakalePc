import React from 'react';
import categoryRule from './CategoryRule';
import merchantRule from './MerchantRule';
import goodsRule from './GoodsRule';
import tagRule from './TagRule';
import availableAreaRule from './AvailableAreaRule';
import userRule from './UserRule';
import userOsRule from './UserOsRule';

export default (props) => {
  const { ruleShowApi } = props;
  const ShowDom = {
    categoryRule,
    merchantRule,
    goodsRule,
    tagRule,
    availableAreaRule,
    unavailableAreaRule: availableAreaRule,
    userRule,
    userOsRule,
  }[ruleShowApi];

  if (!ShowDom) return null;

  return <ShowDom {...props}></ShowDom>;
};
