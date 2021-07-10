import {
  UserOutlined,
  TableOutlined,
  PictureOutlined,
  FontSizeOutlined,
  AppstoreOutlined,
  AlignLeftOutlined,
  MenuOutlined,
} from '@ant-design/icons';
/**
 * 类型选项
 * @header 类型名称
 * @type 大类名称
 * @children 组件选项
 * @icon  组件图标
 * @text  组件名称
 * @type  组件类型
 */
const panelItem = [
  {
    header: '通用配置',
    type: 'public',
    children: [
      {
        icon: <UserOutlined style={{ fontSize: 24 }} />,
        text: '获取信息',
        type: 'userInfo',
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
      },
      {
        icon: <PictureOutlined style={{ fontSize: 24 }} />,
        text: '轮播图片',
        type: 'carouseal',
      },
      {
        icon: <AppstoreOutlined style={{ fontSize: 24 }} />,
        text: '双列图片',
        type: 'doubleImg',
      },
    ],
  },
  {
    header: '文本类',
    type: 'text',
    children: [
      {
        icon: <FontSizeOutlined style={{ fontSize: 24 }} />,
        text: '标题',
        type: 'title',
      },
      {
        icon: <AlignLeftOutlined style={{ fontSize: 24 }} />,
        text: '文本',
        type: 'textArea',
      },
    ],
  },
  {
    header: '选项类',
    type: 'select',
    children: [
      {
        icon: <TableOutlined style={{ fontSize: 24 }} />,
        text: '宫格选项',
        type: 'square',
      },
    ],
  },
  {
    header: '智能列表',
    type: 'list',
    children: [
      {
        icon: <MenuOutlined style={{ fontSize: 24 }} />,
        text: '普通列表',
        type: 'commonList',
      },
    ],
  },
];

export default panelItem;
