import { BgColorsOutlined, PictureOutlined, MenuOutlined } from '@ant-design/icons';
/**
 * 类型选项
 * @header 类型名称
 * @type 大类名称
 * @children 组件选项
 * @icon  组件图标
 * @text  组件名称
 * @type  组件类型
 * @drop 是否可拖拽
 */
const panelItem = [
  {
    header: '通用配置',
    type: 'public',
    children: [
      {
        icon: <BgColorsOutlined style={{ fontSize: 24 }} />,
        text: '背景颜色',
        type: 'backgroundColor',
        drop: false,
      },
    ],
  },
  {
    header: '图片类',
    type: 'img',
    children: [
      {
        icon: <PictureOutlined style={{ fontSize: 24 }} />,
        text: '单张图片',
        type: 'solaImg',
        drop: true,
      },
      {
        icon: <PictureOutlined style={{ fontSize: 24 }} />,
        text: '轮播图片',
        type: 'carouseal',
        drop: true,
      },
    ],
  },
  {
    header: '列表类',
    type: 'list',
    children: [
      {
        icon: <MenuOutlined style={{ fontSize: 24 }} />,
        text: '普通列表',
        type: 'commonList',
        drop: true,
      },
    ],
  },
];

export default panelItem;
