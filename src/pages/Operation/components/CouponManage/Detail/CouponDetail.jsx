import React from 'react';
import { BUSINESS_TYPE, COUPON_WEEK_TIME, COUPON_BUY_RULE } from '@/common/constant';
import DescriptionsCondition from '@/components/DescriptionsCondition';
import MerchantListTable from '../../SpecialGoods/Detail/MerchantListTable';

const GoodsDetail = (props) => {
  const { detail = {} } = props;
  const {
    ownerType = 'merchant',
    merchantIdList: mreList = [],
    buyFlag = '1',
    merchantList = [],
  } = detail;
  // 参与活动的店铺
  const mreFormItems = [
    {
      label: '店铺类型',
      name: 'ownerType',
      render: (val) => BUSINESS_TYPE[val],
    },
    {
      label: `${BUSINESS_TYPE[ownerType]}名称`,
      name: 'ownerName',
    },
    // {
    //   label: '店铺范围',
    //   name: 'merchantIdList',
    //   render: () => '',
    //   show: ownerType === 'group',
    //   children: mreList && mreList.length ? `部分(${mreList.length})` : '全部',
    // },
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
      render: (val) => (val != '0' && val ? `满${val}元可使用` : '无门槛'),
    },
    {
      label: '使用有效期',
      name: 'activeDate',
      render: (val, row) => {
        const { useTimeRule, activeDate, endDate, delayDays, activeDays } = row;
        if (useTimeRule === 'fixed') {
          return activeDate + '~' + endDate;
        } else {
          if (delayDays === '0') {
            return `领取后立即生效\n有效期${activeDays}天`;
          }
          return `领取后${delayDays}天生效\n有效期${activeDays}天`;
        }
      },
    },
    {
      label: '适用时段',
      name: 'useWeek',
      render: (val) => COUPON_WEEK_TIME.filter((item, index) => val.includes(index)),
    },
    {
      label: '使用时间',
      name: 'useTime',
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
              单人每天{['领取', '购买'][buyFlag]}份数: {detail.dayMaxBuyAmount}
            </div>
          )}
        </>
      ),
    },
    {
      label: '使用说明',
      name: 'couponDescString',
    },
    {
      label: '退款规则',
      name: ['reduceObject', 'anytimeRefund'],
      render: (val) =>
        `${val === '1' ? '' : '不'}允许随时退款 \n ${
          detail.reduceObject.expireRefund === '1' ? '' : '不'
        }允许过期退款`,
    },
    // {
    //   label: '优惠券介绍',
    //   name: 'couponsDesc',
    // },
    // {
    //   label: '优惠券图片',
    //   name: 'couponDescImg',
    // },
  ];
  //分佣配置
  const commissionItem = [
    {
      label: '省代分佣金额（元）',
      name: ['serviceDivisionDTO', 'provinceBean'],
    },
    {
      label: '区县分佣金额（元）',
      name: ['serviceDivisionDTO', 'districtBean'],
    },
    {
      label: '哒人分佣金额（元）',
      name: ['serviceDivisionDTO', 'darenBean'],
    },
  ];

  return (
    <>
      <DescriptionsCondition
        title="参与活动的店铺"
        formItems={mreFormItems}
        initialValues={detail}
      ></DescriptionsCondition>
      {ownerType === 'group' && (
        <div style={{ margin: '10px' }}>
          <MerchantListTable merchantList={merchantList || []}></MerchantListTable>
        </div>
      )}
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
      {detail.divisionFlag === '1' && (
        <DescriptionsCondition
          title="分佣配置"
          formItems={commissionItem}
          initialValues={detail}
        ></DescriptionsCondition>
      )}
    </>
  );
};

export default GoodsDetail;
