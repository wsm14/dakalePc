import {
  SUBMIT_TYPE,
  BUSINESS_TYPE,
  SPECIAL_STATUS,
  GOODS_CLASS_TYPE,
  SPECIAL_RECOMMEND_DELSTATUS,
} from '@/common/constant';
import { checkCityName } from '@/utils/utils';

// 导出列表
export default {
  fieldNames: { key: 'key', headerName: 'header' },
  header: [
    { key: 'goodsType', header: '商品类型', render: (val) => GOODS_CLASS_TYPE[val] },
    { key: 'goodsName', header: '商品名称' },
    { key: 'ownerType', header: '店铺类型', render: (val) => BUSINESS_TYPE[val] },
    { key: 'ownerName', header: '店铺名称' },
    { key: 'oriPrice', header: '原价' },
    { key: 'realPrice', header: '特惠价格' },
    { key: 'otherPlatformPrice', header: '其它平台价格' },
    {
      key: 'businessHubIdString',
      header: '折扣',
      render: (val, row) => {
        const zhe = (Number(row.realPrice) / Number(row.oriPrice)) * 10;
        return `${`${zhe}`.substring(0, 4)}折`;
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
    { key: 'topCategoryName', header: '一级行业' },
    { key: 'categoryName', header: '二级行业' },
    { key: 'districtCode', header: '地区', render: (val) => checkCityName(val) || '--' },
    { key: 'businessHub', header: '商圈' },
    { key: 'address', header: '详细地址' },
    {
      key: 'topCategoryName',
      header: '所属行业',
      render: (val, row) => `${val} / ${row.categoryName}`,
    },
    { key: 'createTime', header: '创建时间' },
    {
      key: 'creatorType',
      header: '创建人',
      render: (val, row) => `${SUBMIT_TYPE[val]}--${row.creatorName || ''}`,
    },
    {
      key: 'status',
      header: '状态',
      render: (val, row) =>
        row.deleteFlag === '0'
          ? SPECIAL_RECOMMEND_DELSTATUS[row.deleteFlag]
          : SPECIAL_STATUS[row.status],
    },
  ],
};
