/**
 * 类型选项
 * @header 类型名称
 * @type 类型
 * @children 组件选项 Editor 内定义的 控件键名
 */
export default [
  {
    header: '通用配置',
    type: 'public',
    children: ['solaImg', 'list'],
  },
  {
    header: '图片类',
    type: 'img',
    children: ['solaImg', 'solaImg'],
  },
  {
    header: '列表类',
    type: 'list',
    children: ['solaImg', 'solaImg', 'solaImg'],
  },
  {
    header: '视频类',
    type: 'video',
    children: ['solaImg'],
  },
];
