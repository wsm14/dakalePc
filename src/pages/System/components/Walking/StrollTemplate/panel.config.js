import { PictureOutlined } from '@ant-design/icons';
import mainBanner from './Img/mainBanner.png';
import capsulePosition from './Img/capsulePosition.png';
import recharge from './Img/recharge.png';
import notify from './Img/notify.png';
import windVane from './Img/windVane.png';
import resource from './Img/resource.png';
import limitedTimeAndExplosive from './Img/limitedTimeAndExplosive.png';
import limitedTime from './Img/limitedTime.png';
import explosive from './Img/explosive.png';
import member from './Img/member.png';
import selfTour from './Img/selfTour.png';
import specialRecommend from './Img/specialRecommend.png';
import selfTourResource from './Img/selfTourResource.png';
import newProductRecommend from './Img/newProductRecommend.png';
import beanSpecialArea from './Img/beanSpecialArea.png';
import commerceGoods from './Img/commerceGoods.png';
import beanEducation from './Img/beanEducation.png';
import specialAndSelfTourAndCommerce from './Img/specialAndSelfTourAndCommerce.png';
import selfTourAndCommerce from './Img/selfTourAndCommerce.png';

/**
 * 组件库
 * @param {String} name  组件名称
 * @param {ReactDOM} icon  组件图标
 * @param {String} moduleName  组件类型
 * @param {Boolean} drop 是否可拖拽 如果是不可拖拽的模块 全局唯一只能存在一个
 * @param {ReactDOM} defaultImg 拖拽后默认显示占位图片
 * @param {Boolean} editFormFlag 是否存在编辑表单
 */
export default {
  mainBanner: {
    name: '主banner位',
    icon: <PictureOutlined style={{ fontSize: 24 }} />,
    drop: true,
    defaultImg: mainBanner,
    editFormFlag: true,
  },
  capsulePosition: {
    name: '胶囊位',
    icon: <PictureOutlined style={{ fontSize: 24 }} />,
    drop: true,
    defaultImg: capsulePosition,
  },
  recharge: {
    name: '逛逛话费充值',
    icon: <PictureOutlined style={{ fontSize: 24 }} />,
    drop: true,
    defaultImg: recharge,
  },
  beanSpecialArea: {
    name: '逛逛卡豆位',
    icon: <PictureOutlined style={{ fontSize: 24 }} />,
    drop: true,
    defaultImg: beanSpecialArea,
  },
  notify: {
    name: '通知位',
    icon: <PictureOutlined style={{ fontSize: 24 }} />,
    drop: true,
    defaultImg: notify,
  },
  windVane: {
    name: '风向标',
    icon: <PictureOutlined style={{ fontSize: 24 }} />,
    drop: true,
    defaultImg: windVane,
  },
  resource: {
    name: '逛逛资源位',
    icon: <PictureOutlined style={{ fontSize: 24 }} />,
    drop: true,
    defaultImg: resource,
  },
  limitedTimeAndExplosive: {
    name: '限时+爆品',
    icon: <PictureOutlined style={{ fontSize: 24 }} />,
    drop: true,
    defaultImg: limitedTimeAndExplosive,
  },
  limitedTime: {
    name: '限时抢购',
    icon: <PictureOutlined style={{ fontSize: 24 }} />,
    drop: true,
    defaultImg: limitedTime,
  },
  explosive: {
    name: '爆品福利',
    icon: <PictureOutlined style={{ fontSize: 24 }} />,
    drop: true,
    defaultImg: explosive,
  },
  member: {
    name: '会员充值',
    icon: <PictureOutlined style={{ fontSize: 24 }} />,
    drop: true,
    defaultImg: member,
  },
  selfTour: {
    name: '自我游',
    icon: <PictureOutlined style={{ fontSize: 24 }} />,
    drop: true,
    defaultImg: selfTour,
  },
  specialRecommend: {
    name: '特惠推荐',
    icon: <PictureOutlined style={{ fontSize: 24 }} />,
    drop: true,
    defaultImg: specialRecommend,
  },
  selfTourResource: {
    name: '自我游',
    icon: <PictureOutlined style={{ fontSize: 24 }} />,
    drop: true,
    defaultImg: selfTourResource,
  },
  newProductRecommend: {
    name: '新品推荐',
    icon: <PictureOutlined style={{ fontSize: 24 }} />,
    drop: true,
    defaultImg: newProductRecommend,
  },
  commerceGoods: {
    name: '电商品',
    icon: <PictureOutlined style={{ fontSize: 24 }} />,
    drop: true,
    defaultImg: commerceGoods,
  },
  beanEducation: {
    name: '卡豆教育',
    icon: <PictureOutlined style={{ fontSize: 24 }} />,
    drop: true,
    defaultImg: beanEducation,
  },
  specialAndSelfTourAndCommerce: {
    name: '特惠+自我游+电商品',
    icon: <PictureOutlined style={{ fontSize: 24 }} />,
    drop: true,
    defaultImg: specialAndSelfTourAndCommerce,
  },
  selfTourAndCommerce: {
    name: '自我游+电商品',
    icon: <PictureOutlined style={{ fontSize: 24 }} />,
    drop: true,
    defaultImg: selfTourAndCommerce,
  },
};
