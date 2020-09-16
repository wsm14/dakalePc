import { PictureOutlined, FontSizeOutlined } from '@ant-design/icons';
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
    ],
  },
];

export default panelItem;
