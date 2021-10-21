import { PictureOutlined } from '@ant-design/icons';
import img from './Img/img.png';
import list from './Img/list.png';

/**
 * 组件库
 * @param {String} name  组件名称
 * @param {ReactDOM} icon  组件图标
 * @param {String} moduleType  组件类型
 * @param {Boolean} drop 是否可拖拽 如果是不可拖拽的模块 全局唯一只能存在一个
 * @param {ReactDOM} defaultImg 拖拽后默认显示占位图片
 */
export default {
  solaImg: {
    name: '单张图片',
    icon: <PictureOutlined style={{ fontSize: 24 }} />,
    moduleType: 'solaImg',
    drop: true,
    defaultImg: img,
  },
  list: {
    name: '列表图片',
    icon: <PictureOutlined style={{ fontSize: 24 }} />,
    moduleType: 'list',
    drop: true,
    defaultImg: list,
  },
};
