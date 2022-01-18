import React from 'react';
import {
  CONPON_RULES_TYPE,
  PLATFORM_TICKET_SCENE,
  PLATFORM_TICKET_TYPE,
  PLATFORM_COUPON_PEOPLE,
  PLATFORM_APPLY_PORT_TYPE,
} from '@/common/constant';
import { getCityName } from '@/utils/utils';
import DescriptionsCondition from '@/components/DescriptionsCondition';

const GoodsDetail = (props) => {
  const { detail = {} } = props;

  const mreFormItems = [
    {
      label: '规则类型',
      name: 'ruleType',
      render: (val) => CONPON_RULES_TYPE[val],
    },
    {
      label: '规则名称',
      name: 'subRuleType',
    },
  ];

  return (
    <>
      <DescriptionsCondition
        formItems={mreFormItems}
        initialValues={detail}
      ></DescriptionsCondition>
    </>
  );
};

export default GoodsDetail;
