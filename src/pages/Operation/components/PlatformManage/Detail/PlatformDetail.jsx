import React from 'react';
import {
  BUSINESS_TYPE,
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
      label: '券类型',
      name: 'useScenesType',
      render: (val, row) => `${PLATFORM_TICKET_SCENE[val]}${PLATFORM_TICKET_TYPE[row.classType]}`,
    },
    {
      label: '券编号',
      name: 'platformCouponId',
    },
    {
      label: '券标题',
      name: 'couponName',
    },
    {
      label: '券描述',
      name: 'couponDesc',
    },
    {
      label: '券价值',
      name: 'couponValue',
      render: (val) => `￥${val}`,
    },
    {
      label: '使用门槛',
      name: 'thresholdPrice',
      render: (val) => `满${val}元可用`,
    },
    {
      label: '券有效期',
      name: 'useTimeRule',
      render: (val, row) => {
        const { activeDate, endDate, delayDays, activeDays } = row;
        if (activeDate && endDate) {
          return activeDate + '~' + endDate;
        } else {
          if (delayDays === '0') {
            return `领取后立即生效,有效期${activeDays}天`;
          }
          return `领取后${delayDays}天生效,有效期${activeDays}天`;
        }
      },
    },
    {
      label: '发放总量',
      name: 'total',
      render: (val) => `${val}张`,
    },
    {
      label: '领取上限',
      name: 'ruleType',
      render: (val, row) =>
        ({
          unlimited: '不限',
          personLimit: `每人限制领取${row.personLimit}张`,
          dayLimit: `每人每天限制领取${row.dayMaxBuyAmount}张`,
        }[val]),
    },
    {
      label: '使用地区限制',
      name: 'ruleCondition',
      render: (val, row) => {
        return (
          <div>
            <div>{['全国可用', '部分地区可用', '部分地区不可用'][val]}</div>
            <div>{row.citys.map((item) => `${getCityName(item)}、`)}</div>
          </div>
        );
      },
    },
    {
      label: '适用人群',
      name: 'consortUser',
      render: (val) => PLATFORM_COUPON_PEOPLE[val],
    },
    {
      label: '适用端口',
      name: 'consortUserOs',
      render: (val, row) =>
        val === 'all' ? '全平台' : row.apply.map((item) => `${PLATFORM_APPLY_PORT_TYPE[item]},`),
    },
    {
      label: '其他说明',
      name: 'otherDesc',
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
