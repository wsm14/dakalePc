/**
 * 类型选项
 * @header 类型名称
 * @type 类型
 * @children 组件选项 Editor 内定义的 控件键名
 */
export default [
  {
    header: '广告营销',
    type: 'public',
    children: ['mainBanner', 'capsulePosition', 'recharge', 'beanSpecialArea', 'notify'],
  },
  {
    header: '功能区',
    type: 'img',
    children: ['windVane', 'resource', 'beanEducation'],
  },
  {
    header: '商品推荐',
    type: 'list',
    children: [
      'limitedTimeAndExplosive',
      'limitedTime',
      'explosive',
      'member',
      'selfTourResource',
      'newProductRecommend',
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
    ],
  },
];
