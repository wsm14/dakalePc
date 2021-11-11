import React from 'react';
import {
  BUSINESS_TYPE,
  COUPON_WEEK_TIME,
  COUPON_BUY_RULE,
  SPECIAL_DESC_TYPE,
  PEQUITY_GOODSBUY_TYPE,
  COMMISSION_TYPE,
} from '@/common/constant';
import DescriptionsCondition from '@/components/DescriptionsCondition';
import MerchantListTable from '@/pages/Operation/components/SpecialGoods/Detail/MerchantListTable';

const GoodsDetail = (props) => {
  const { detail = {}, merchantList = [] } = props;
  const {
    relateType = 'merchant',
    buyFlag = '1',
    couponDetailType,
    serviceDivisionDTO = {},
  } = detail;

  const { divisionTemplateType, ...other } = serviceDivisionDTO; // 分佣

  // 参与活动的店铺
  const mreFormItems = [
    {
      label: '店铺类型',
      name: 'relateType',
      render: (val) => BUSINESS_TYPE[val],
    },
    {
      label: `${BUSINESS_TYPE[relateType]}名称`,
      name: 'relateName',
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
      name: 'buyFlag',
      label: '售卖类型',
      render: (val) => PEQUITY_GOODSBUY_TYPE[val],
    },
    {
      label: '卡豆+现金',
      show: buyFlag === '1',
      name: 'paymentModeObject',
      render: (val) => `${val.bean || 0} 卡豆 + ${val.cash} 元`,
    },
    {
      label: '商家结算价',
      name: 'merchantPrice',
      show: buyFlag === '1',
      render: (val) => `￥ ${val}`,
    },
    {
      label: '介绍类型',
      name: 'couponDetailType',
      render: (val) => SPECIAL_DESC_TYPE[val],
    },
    {
      label: `优惠券介绍`,
      name: 'richText',
      show: couponDetailType === '1',
      render: (val) => <div dangerouslySetInnerHTML={{ __html: val }}></div>,
    },
    {
      label: '优惠券介绍',
      name: 'couponDetail',
      show: couponDetailType === '0',
    },
    {
      label: '优惠券图片',
      type: 'upload',
      name: 'couponDetailImg',
      show: couponDetailType === '0',
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
  ];

  //分佣配置
  const commissionItem = Object.keys(other).map((i) => ({
    label: `${COMMISSION_TYPE[i.replace('Bean', '')]}卡豆`,
    name: ['serviceDivisionDTO', i],
  }));

  return (
    <>
      <DescriptionsCondition
        title="参与活动的店铺"
        formItems={mreFormItems}
        initialValues={detail}
      ></DescriptionsCondition>
      {relateType === 'group' && (
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
      {detail.divisionFlag === '1' && buyFlag === '1' && (
        <DescriptionsCondition
          title="分佣配置（卡豆）"
          formItems={commissionItem}
          initialValues={detail}
        ></DescriptionsCondition>
      )}
    </>
  );
};

export default GoodsDetail;
