import React from 'react';
import DescriptionsCondition from '@/components/DescriptionsCondition';
import {
  COUPON_BUY_RULE,
  COUPON_WEEK_TIME,
  SPECIAL_SHOW_TYPE,
  SPECIAL_BALANCE_TYPE,
  SPECIAL_DESC_TYPE,
  GOODS_CLASS_TYPE,
} from '@/common/constant';

const RegularDetail = (props) => {
  const { detail } = props;
  const { productType, descType } = detail;

  const RegularItems = [
    {
      name: 'activityTimeRule',
      label: '活动时间',
      render: (val, row) =>
        val == 'infinite' ? `长期` : `${row.activityStartTime}~${row.activityStartTime}`,
    },
    {
      name: 'useTimeRuleObject',
      label: '使用有效期',
      render: (val, row) => {
        const { startDate = [], type, delayDays, activeDays } = val || {};
        if (!type) return '';
        if (type === 'fixed') {
          // return startDate[0].format('YYYY-MM-DD') + '~' + startDate[1].format('YYYY-MM-DD');
        } else {
          if (delayDays === '0') {
            return `领取后立即生效\n有效期${activeDays}天`;
          }
          return `领取后${delayDays}天生效\n有效期${activeDays}天`;
        }
      },
    },
    {
      name: 'useTimeRuleObject', // COUPON_USER_TIME
      label: '适用时段',
      render: (val, row) => {
        const { useDay } = val || {};
        let week = '每周';
        if (row.timeSplit == 'part') {
          row.useWeek.forEach((item, index) => {
            week += `${COUPON_WEEK_TIME[item]}`;
            return week;
          });
        }
        const times = useDay ? useDay : row.timeType;
        return <>{row.timeSplit == 'part' ? `${week}--${times}` : `每天--${times}`}</>;
      },
    },
    {
      name: ['useTimeRuleObject', 'total'],
      label: '投放总量',
      render: (val) => (val ? `${val}份` : '--'),
    },
  ];

  const BuyRegularItem = [
    {
      name: [('skuInfoReq', 'buyLimitRuleObject', 'type')],
      label: '购买上限',
      render: (val) => COUPON_BUY_RULE[val],
    },
    {
      label: `单人${
        { personLimit: '每人', dayLimit: '每天', unlimited: '不限' }[
          detail?.skuInfoReq?.buyLimitRuleObject?.type
        ]
      }购买份数`,
      name: [('skuInfoReq', 'buyLimitRuleObject', 'limitNum')],
      render: (val) => (val ? `${val}份` : '--'),
    },
    {
      name: 'needOrder',
      label: '是否需要预约购买',
      render: (val) => (val == 1 ? '是' : '否'),
    },
    {
      name: 'allowRefund',
      label: '是否允许随时退款',
      render: (val) => (val == 1 ? '是' : '否'),
    },
    {
      name: 'expireRefund',
      label: '是否允许过期退款',
      render: (val) => (val == 1 ? '是' : '否'),
    },
    {
      name: 'buyDesc',
      label: '购买须知',
      render: (val) => val.map((items, ins) => <div key={ins}>{items}</div>),
    },
    {
      name: 'allowRefund',
      label: '退款规则',
      render: (val, row) => (
        <>
          <div>
            <span style={{ marginRight: '8px' }}>是否允许随时退款:</span>
            <span>{val == 1 ? '是' : '否'}</span>
          </div>
          <div>
            <span style={{ marginRight: '8px' }}>是否允许过期退款: </span>
            <span>{row.allowExpireRefund == 1 ? '是' : '否'}</span>
          </div>
        </>
      ),
    },
  ];
  const ExhibitionItem = [
    {
      name: 'displayType',
      label: '前端展示类型',
      render: (val, row) => SPECIAL_SHOW_TYPE[row.paymentModeType][val],
    },
    {
      name: 'displayType',
      label: 'availableAreas',
      render: (val, row) => val,
    },
    {
      label: '平台商品标签',
      name: 'platformGoodsTagList',
      // show: detail.goodsTagList,
      render: (val, row) => {
        const { platformGoodsTagList = [] } = row;
        const tags = platformGoodsTagList.filter((items) => items.tagType === 'platform');
        return (
          <>
            {tags &&
              tags.map((tag) => (
                <span
                  style={{
                    display: 'inline-block',
                    padding: 8,
                    margin: '5px',
                    border: '1px solid #ddd',
                  }}
                  key={tag.configGoodsTagId}
                >
                  {tag.tagName}
                </span>
              ))}
          </>
        );
      },
    },
    {
      label: '平台商品标签',
      name: 'platformGoodsTagList',
      // show: detail.goodsTagList,
      render: (val, row) => {
        const { platformGoodsTagList = [] } = row;
        const tags = platformGoodsTagList.filter((items) => items.tagType === 'platform');
        return (
          <>
            {tags &&
              tags.map((tag) => (
                <span
                  style={{
                    display: 'inline-block',
                    padding: 8,
                    margin: '5px',
                    border: '1px solid #ddd',
                  }}
                  key={tag.configGoodsTagId}
                >
                  {tag.tagName}
                </span>
              ))}
          </>
        );
      },
    },
  ];
  const SettlementItem = [
    {
      name: ['settleInfoResp', 'settlerType'],
      label: '结算人类型',
      render: (val, row) => SPECIAL_BALANCE_TYPE[val],
    },
    {
      name: ['settleInfoResp', 'settlerName'],
      label: '结算店铺名称',
    },
  ];

  const GoodDecItem = [
    {
      label: '介绍类型',
      name: 'descType',
      render: (val) => SPECIAL_DESC_TYPE[val],
    },
    {
      label: `${GOODS_CLASS_TYPE[productType]}介绍`,
      name: 'richText',
      show: descType === '1',
      render: (val) => <div dangerouslySetInnerHTML={{ __html: val }}></div>,
    },
    {
      label: `${GOODS_CLASS_TYPE[productType]}介绍`,
      name: 'goodsDesc',
      show: descType === '0',
      type: 'textArea',
    },
    {
      label: `${GOODS_CLASS_TYPE[productType]}介绍图片`,
      name: 'goodsDescImg',
      show: descType === '0',
      type: 'upload',
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
      <DescriptionsCondition
        title="展示信息"
        formItems={ExhibitionItem}
        initialValues={detail}
      ></DescriptionsCondition>
      <DescriptionsCondition
        title="结算信息"
        formItems={SettlementItem}
        initialValues={detail}
      ></DescriptionsCondition>
      <DescriptionsCondition
        title="商品介绍"
        formItems={GoodDecItem}
        initialValues={detail}
      ></DescriptionsCondition>
    </>
  );
};
export default RegularDetail;
