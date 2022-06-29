import React from 'react';
import ShareCoupon from '../ShareCoupon/ShareCoupon';
import DescriptionsCondition from '@/components/DescriptionsCondition';

const GoodsDetail = (props) => {
  const { detail = {}, giftTypeList = [] } = props;

  console.log('detail', detail);

  const mreFormItems = [
    {
      label: '礼包类型',
      name: 'giftTypeId',
      render: (val) => giftTypeList.find((item) => item.giftTypeId == val)?.typeName,
    },
    {
      label: '礼包名称',
      name: 'giftName',
    },
    {
      label: '礼包价格',
      name: 'buyFlagType',
      render: (val, row) =>
        val === '0'
          ? '免费'
          : val === '1'
          ? `￥${Number(row.buyPrice).toFixed(2)}`
          : `${row.bean}卡豆+${Number(row.buyPriceCash).toFixed(2)}元`,
    },
    {
      label: '礼包价值',
      name: 'giftValue',
      render: (val) => `￥${Number(val).toFixed(2)}`,
    },
    {
      label: '礼包内容',
      name: 'platformGiftPackRelateList',
      render: (val) => <ShareCoupon data={val}></ShareCoupon>,
    },
    {
      label: '礼包数量',
      name: 'total',
    },
    {
      label: '发放时间段',
      name: 'activeDate',
      render: (val) => {
        return val && `${val[0].format('YYYY-MM-DD')}~${val[1].format('YYYY-MM-DD')}`;
      },
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
      label: '其他说明',
      name: 'otherDesc',
    },
  ];

  return (
    <DescriptionsCondition formItems={mreFormItems} initialValues={detail}></DescriptionsCondition>
  );
};

export default GoodsDetail;
