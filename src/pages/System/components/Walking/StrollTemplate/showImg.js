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
  mainBanner: {
    name: '主banner位',
    icon: <PictureOutlined style={{ fontSize: 24 }} />,
    moduleType: 'mainBanner',
    drop: true,
    defaultImg: img,
  },
  capsulePosition: {
    name: '胶囊位',
    icon: <PictureOutlined style={{ fontSize: 24 }} />,
    moduleType: 'capsulePosition',
    drop: true,
    defaultImg: img,
  },
  recharge: {
    name: '逛逛话费充值',
    icon: <PictureOutlined style={{ fontSize: 24 }} />,
    moduleType: 'recharge',
    drop: true,
    defaultImg: img,
  },
  notify: {
    name: '通知位',
    icon: <PictureOutlined style={{ fontSize: 24 }} />,
    moduleType: 'notify',
    drop: true,
    defaultImg: img,
  },
  windVane: {
    name: '风向标',
    icon: <PictureOutlined style={{ fontSize: 24 }} />,
    moduleType: 'windVane',
    drop: true,
    defaultImg: list,
  },
  resource: {
    name: '逛逛资源位',
    icon: <PictureOutlined style={{ fontSize: 24 }} />,
    moduleType: 'resource',
    drop: true,
    defaultImg: list,
  },
  limitedTimeAndExplosive: {
    name: '限时+爆品',
    icon: <PictureOutlined style={{ fontSize: 24 }} />,
    moduleType: 'limitedTimeAndExplosive',
    drop: true,
    defaultImg: list,
  },
  limitedTime: {
    name: '限时抢购',
    icon: <PictureOutlined style={{ fontSize: 24 }} />,
    moduleType: 'limitedTime',
    drop: true,
    defaultImg: list,
  },
  explosive: {
    name: '爆品福利',
    icon: <PictureOutlined style={{ fontSize: 24 }} />,
    moduleType: 'explosive',
    drop: true,
    defaultImg: list,
  },
  member: {
    name: '会员充值',
    icon: <PictureOutlined style={{ fontSize: 24 }} />,
    moduleType: 'member',
    drop: true,
    defaultImg: list,
  },
  selfTour: {
    name: '自我游',
    icon: <PictureOutlined style={{ fontSize: 24 }} />,
    moduleType: 'selfTour',
    drop: true,
    defaultImg: list,
  },
  specialRecommend: {
    name: '特惠推荐',
    icon: <PictureOutlined style={{ fontSize: 24 }} />,
    moduleType: 'specialRecommend',
    drop: true,
    defaultImg: list,
  },
};
