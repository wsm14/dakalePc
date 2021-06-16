import { BUSINESS_TYPE, SPECIAL_STATUS, GOODS_CLASS_TYPE } from '@/common/constant';

// 导出列表
export default {
  fieldNames: { key: 'key', headerName: 'header' },
  header: [
    { key: 'goodsType', header: '商品类型', render: (val) => GOODS_CLASS_TYPE[val] },
    { key: 'goodsName', header: '商品名称' },
    { key: 'ownerType', header: '店铺类型', render: (val) => BUSINESS_TYPE[val] },
    { key: 'merchantName', header: '店铺名称' },
    { key: 'oriPrice', header: '原价' },
    { key: 'realPrice', header: '特惠价格' },
    { key: 'otherPlatformPrice', header: '其它平台价格' },
    {
      key: 'businessHubIdString',
      header: '折扣',
      render: (val, row) => {
        const zhe = (Number(row.realPrice) / Number(row.oriPrice)) * 10;
        return `${zhe < 0.1 || (zhe > 0.1 && zhe < 1) ? zhe.toFixed(2) : zhe.toFixed(0)}折`;
      },
    },
    { key: 'merchantPrice', header: '商家结算价' },
    {
      key: 'realPrice',
      header: '佣金',
      render: (val, row) => (Number(row.realPrice) - Number(row.merchantPrice)).toFixed(2),
    },
    {
      key: 'activityStartTime',
      header: '活动时间',
      render: (val, row) =>
        row.activityTimeRule === 'infinite'
          ? `${row.createTime} ~ 长期`
          : `${val} ~ ${row.activityEndTime}`,
    },
    {
      key: 'useStartTime',
      header: '使用有效期',
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
    { key: 'total', header: '投放总量' },
    { key: 'remain', header: '剩余数量' },
    { key: 'soldGoodsCount', header: '销量' },
    {
      key: 'writeOffGoodsCount',
      header: '核销数量',
    },
    { key: 'createTime', header: '创建时间' },
    { key: 'creatorName', header: '创建人' },
    { key: 'status', header: '状态', render: (val) => SPECIAL_STATUS[val] },
  ],
};
