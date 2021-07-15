import { BgColorsOutlined, PictureOutlined, ShoppingOutlined } from '@ant-design/icons';
import BackgroundColor from './BackgroundColor';
import SolaImg from './SolaImg';
import img from './Img/img.png';
import list from './Img/list.png';

/**
 * 组件库
 * @param {String} name  组件名称
 * @param {ReactDOM} icon  组件图标
 * @param {String} type  组件类型
 * @param {Boolean} drop 是否可拖拽
 * @param {ReactDOM} defaultImg 拖拽后默认显示占位图片
 * @param {ReactDOM} editor 详细组件编辑容器 ({ cRef, type 组件type, value 原值 })
 */
export default {
  backgroundColor: {
    name: '背景颜色',
    icon: <BgColorsOutlined style={{ fontSize: 24 }} />,
    type: 'backgroundColor',
    drop: false,
    editorDom: (props) => <BackgroundColor {...props}></BackgroundColor>,
  },
  solaImg: {
    name: '单张图片',
    icon: <PictureOutlined style={{ fontSize: 24 }} />,
    type: 'solaImg',
    drop: true,
    defaultImg: img,
    editorDom: (props) => <SolaImg {...props}></SolaImg>,
  },
  carouseal: {
    name: '轮播图片',
    icon: <PictureOutlined style={{ fontSize: 24 }} />,
    type: 'carouseal',
    drop: true,
    defaultImg: img,
  },
  commonList: {
    icon: <ShoppingOutlined style={{ fontSize: 24 }} />,
    name: '商品列表',
    type: 'commonList',
    drop: true,
    defaultImg: list,
  },
};
