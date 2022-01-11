/**
 *
 * type 模版类型 active rule
 *
 * 类型选项
 * @header 类型名称
 * @type 类型
 * @children 组件选项 Editor 内定义的 控件键名
 */
export default (type = '') => {
  const moduleAllShow = ['active', 'rule', 'globalModal'].includes(type); // 全都展示
  const moduleActiveShow = ['active'].includes(type); // 只有活动展示
  const moduleRuleShow = ['rule'].includes(type); // 只有规则展示

  return [
    {
      header: '通用配置',
      type: 'public',
      show: type !== 'globalModal',
      children: [
        { type: 'backgroundColor', show: true },
        { type: 'share', show: moduleActiveShow },
      ],
    },
    {
      header: '图片类',
      type: 'img',
      show: moduleAllShow,
      children: [
        { type: 'solaImg', show: true },
        { type: 'carouseal', show: moduleActiveShow },
      ],
    },
    {
      header: '列表类',
      type: 'list',
      show: moduleActiveShow,
      children: [
        { type: 'commonList', show: moduleActiveShow },
        { type: 'merchantList', show: moduleActiveShow },
        { type: 'couponList', show: moduleActiveShow },
        { type: 'commerceGoods', show: moduleActiveShow },
      ],
    },
    {
      header: '视频类',
      type: 'video',
      show: moduleActiveShow,
      children: [{ type: 'normalVideo', show: true }],
    },
    {
      header: '文字类',
      type: 'text',
      show: moduleRuleShow,
      children: [{ type: 'richText', show: true }],
    },
  ];
};
