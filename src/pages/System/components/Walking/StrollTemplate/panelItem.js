/**
 * 类型选项
 * @header 类型名称
 * @type 类型
 * @children 组件选项 Editor 内定义的 控件键名
 */
export default [
  {
    header: '通用配置',
    type: 'common',
    children: ['topBackground', 'spaceOccupyingLattice'],
  },
  {
    header: '广告营销',
    type: 'public',
    children: [
      'mainBanner',
      'capsulePosition',
      // 'recharge', // 逛逛话费充值
      // 'beanSpecialArea', // 逛逛卡豆位
      // 'notify', // 通知位
      'signInModule',
      'beanBalance',
      'strollAroundMainBannerBigpicture', // 主banner-大图
    ],
  },
  {
    header: '功能区',
    type: 'img',
    children: [
      'windVane',
      'resource',
      'beanEducation',
      'sixPalaceLattice',
      'seasonalKeyAndBicuspidLattice', //  应季主打+二宫格
      'trigonometry', // 三宫格
    ],
  },
  {
    header: '商品推荐',
    type: 'list',
    children: [
      // 'limitedTimeAndExplosive', // 限时+爆品
      // 'limitedTime', // 限时抢购
      // 'explosive', // 爆品福利
      // 'member', // 会员充值
      'selfTourResource',
      // 'newProductRecommend', // 新品推荐
      'beanDeductionZone',
      'fieldResource',
      'timeLimitedCoupon',
      'limitedTimeHotMixing',
      'userParticipation',
    ],
  },
  {
    header: '商品推荐流',
    type: 'video',
    children: [
      'selfTour',
      'specialRecommend',
      'commerceGoods',
      'specialAndSelfTourAndCommerce',
      'selfTourAndCommerce',
      'commerceAndSpecial', // 电商品+特惠品
    ],
  },
];
