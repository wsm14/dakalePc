import React from 'react';
import { BUSINESS_TYPE, COUPON_WEEK_TIME, COUPON_BUY_RULE } from '@/common/constant';
import DescriptionsCondition from '@/components/DescriptionsCondition';

const PreferentialDetail = (props) => {
  const { detail = {} } = props;
  const { ownerType = 'merchant', merchantIdList: mreList = [], buyFlag = '1' } = detail;
  // 参与活动的店铺
  const mreFormItems = [
    {
      label: '店铺类型',
      name: 'ownerType',
      render: (val) => BUSINESS_TYPE[val],
    },
    {
      label: `${BUSINESS_TYPE[ownerType]}名称`,
      name: 'merchantName',
    },
    {
      label: '店铺范围',
      name: 'merchantIdList',
      render: () => '',
      children: mreList && mreList.length ? `部分${mreList.length}` : '全部',
    },
  ];

  // 券信息
  const couponFormItems = [
    {
      label: '券名称',
      name: 'couponName',
    },
    {
      label: '券价值',
      name: ['reduceObject', 'couponPrice'],
      render: (val) => `￥ ${val}`,
    },
    {
      label: '售卖价格',
      name: 'buyPrice',
      show: buyFlag === '1',
      render: (val) => `￥ ${val}`,
    },
    {
      label: '商家结算价',
      name: 'merchantPrice',
      show: buyFlag === '1',
      render: (val) => `￥ ${val}`,
    },
  ];

  // 使用规则
  const useFormItems = [
    {
      label: '使用门槛',
      name: ['reduceObject', 'thresholdPrice'],
      render: (val) => (val === '0' ? '无门槛' : `满${val}元可使用`),
    },
    {
      label: '使用有效期',
      name: 'activeDate',
      render: (val, row) => {
        val && row.endDate
          ? `有效期：${val} - ${row.endDate}`
          : row.delayDays != 0
          ? `领取后${row.delayDays}天生效｜有效期${row.activeDays}天`
          : `有效期：领取后${row.activeDays}天内`;
      },
    },
    {
      label: '适用时段',
      name: ['availableTime', 'dayType'],
      render: (val) =>
        val === 'all' ? '全天' : COUPON_WEEK_TIME.filter((item, index) => val.includes(index)),
    },
    {
      label: '使用时间',
      name: ['availableTime', 'timeType'],
      render: (val, row) => `${val === 'all' ? '全天' : row.availableTime.timeRange}`,
    },
    {
      label: '投放总量',
      name: 'total',
    },
    {
      label: `${['领取', '购买'][buyFlag]}上限`,
      name: 'buyRule',
      render: (val) => COUPON_BUY_RULE[val] || '--',
      children: (
        <>
          {detail.buyRule === 'personLimit' && (
            <div>
              单人每人{['领取', '购买'][buyFlag]}份数: {detail.personLimit}
            </div>
          )}
          {detail.buyRule === 'dayLimit' && (
            <div>
              单人每天{['领取', '购买'][buyFlag]}份数: {detail.dayMaxByAmount}
            </div>
          )}
        </>
      ),
    },
    {
      label: '使用说明',
      name: 'couponDesc',
    },
    {
      label: '退款规则',
      name: ['reduceObject', 'anytimeRefund'],
      render: (val) =>
        `${val === '1' ? '' : '不'}允许随时退款 \n ${
          detail.reduceObject.expireRefund === '1' ? '' : '不'
        }允许过期退款`,
    },
  ];

  return (
    <>
      <DescriptionsCondition
        title="参与活动的店铺"
        formItems={mreFormItems}
        initialValues={detail}
      ></DescriptionsCondition>
      <DescriptionsCondition
        title="券信息"
        formItems={couponFormItems}
        initialValues={detail}
      ></DescriptionsCondition>
      <DescriptionsCondition
        title="使用规则"
        formItems={useFormItems}
        initialValues={detail}
      ></DescriptionsCondition>
    </>
  );
};

export default PreferentialDetail;
