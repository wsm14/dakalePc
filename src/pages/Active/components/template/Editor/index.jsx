import { BgColorsOutlined, PictureOutlined, MenuOutlined } from '@ant-design/icons';
import BackgroundColor from './BackgroundColor';

/**
 * 类型选项
 * @param {String} text  组件名称
 * @param {ReactDOM} icon  组件图标
 * @param {String} type  组件类型
 * @param {Boolean} drop 是否可拖拽
 * @param {ReactDOM} editor 详细组件编辑容器
 */
export default {
  backgroundColor: {
    text: '背景颜色',
    icon: <BgColorsOutlined style={{ fontSize: 24 }} />,
    type: 'backgroundColor',
    drop: false,
    editorDom: (props) => <BackgroundColor {...props}></BackgroundColor>,
  },
  solaImg: {
    text: '单张图片',
    icon: <PictureOutlined style={{ fontSize: 24 }} />,
    type: 'solaImg',
    drop: true,
  },
  carouseal: {
    text: '轮播图片',
    icon: <PictureOutlined style={{ fontSize: 24 }} />,
    type: 'carouseal',
    drop: true,
  },
  commonList: {
    icon: <MenuOutlined style={{ fontSize: 24 }} />,
    text: '普通列表',
    type: 'commonList',
    drop: true,
  },
};
