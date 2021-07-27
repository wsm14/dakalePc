import { COUPON_STATUS, COUPON_TYPE, BUSINESS_TYPE } from '@/common/constant';

export default {
  fieldNames: { key: 'key', headerName: 'header' },
  header: [
    { key: 'couponType', header: '券类型', render: (val) => COUPON_TYPE[val] },
    { key: 'couponName', header: '券名称' },
    { key: 'ownerType', header: '店铺类型', render: (val) => BUSINESS_TYPE[val] },
    { key: 'ownerName', header: '店铺/集团名称' },
    { key: ['reduceObject', 'couponPrice'], header: '券价值' },
    { key: 'buyPrice', header: '售卖价', render: (val) => val || '0.00' },
    {
      key: ['reduceObject', 'thresholdPrice'],
      header: '使用门槛',
      render: (val) => (val === '0' || !val ? '无门槛' : `满${val}元可使用`),
    },
    {
      key: 'activeDate',
      header: '使用有效期',
      render: (val, row) => {
        const { activeDate, endDate, delayDays, activeDays } = row;
        if (activeDate && endDate) {
          return activeDate + '~' + endDate;
        } else {
          if (delayDays === '0') {
            return `领取后立即生效\n有效期${activeDays}天`;
          }
          return `领取后${delayDays}天生效\n有效期${activeDays}天`;
        }
      },
    },
    { key: 'remain', header: '剩余数量' },
    { key: 'total', header: '销量', render: (val, row) => val - row.remain },
    { key: 'verifiedCount', header: '核销数量' },
    { key: 'createTime', header: '创建时间' },
    { key: 'updateTime', header: '发布时间' },
    { key: 'ownerCouponStatus', header: '状态', render: (val) => COUPON_STATUS[val] },
  ],
};
