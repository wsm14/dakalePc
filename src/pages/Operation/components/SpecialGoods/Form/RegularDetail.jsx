import React, { useState } from 'react';
import DescriptionsCondition from '@/components/DescriptionsCondition';

const RegularDetail = (props) => {
  const { detail } = props;
  const RegularItems = [
    {
      name: 'goodsType',
      label: '活动时间',
    },
    {
      name: 'goodsType',
      label: '使用有效期',
      render: (val, row) => {
        const { useStartTime, useEndTime, useTimeRule, delayDays, activeDays } = row;
        if (!useTimeRule) return '';
        if (useTimeRule === 'fixed') {
          return useStartTime + '~' + useEndTime;
        } else {
          if (delayDays === '0') {
            return `领取后立即生效\n有效期${activeDays}天`;
          }
          return `领取后${delayDays}天生效\n有效期${activeDays}天`;
        }
      },
    },
    {
      name: 'activityStartTime',
      label: '适用时段',
      render:(val,row)=>`${val}-${row.activityEndTime}`
    },
    {
      name: 'commissionRatio',
      label: '投放总量',
    },
  ];
  const BuyRegularItem = [
    {
      name: 'goodsType',
      label: '购买上限',
    },
    {
      name: 'goodsType',
      label: '每日单人最高购买份数',
    },
    {
      name: 'goodsType',
      label: '是否需要预约购买',
    },
    {
      name: 'goodsType',
      label: '购买须知',
    },
    {
      name: 'goodsType',
      label: '退款规则',
    },
  ];

  return (
    <>
      <DescriptionsCondition
        title="投放规则"
        formItems={RegularItems}
        initialValues={detail}
      ></DescriptionsCondition>
      <DescriptionsCondition
        title="购买规则"
        formItems={BuyRegularItem}
        initialValues={detail}
      ></DescriptionsCondition>
    </>
  );
};
export default RegularDetail;
