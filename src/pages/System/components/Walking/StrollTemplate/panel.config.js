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
import sixPalaceLattice from './Img/sixPalaceLattice.png';
import specialAndSelfTourAndCommerce from './Img/specialAndSelfTourAndCommerce.png';
import selfTourAndCommerce from './Img/selfTourAndCommerce.png';
import beanDeductionZone from './Img/beanDeductionZone.png';
import fieldResource from './Img/fieldResource.png';
import timeLimitedCoupon from './Img/timeLimitedCoupon.png';
import limitedTimeHotMixing from './Img/limitedTimeHotMixing.png';
import signInModule from './Img/signInModule.png';
import beanRemaining from './Img/beanRemaining.png';
import userParticipation from './Img/userParticipation.png';
import strollAroundMainBannerBigpicture from './Img/strollAroundMainBannerBigpicture.png';
import seasonalKeyAndBicuspidLattice from './Img/seasonalKeyAndBicuspidLattice.png';
import trigonometry from './Img/trigonometry.png';
import commerceAndSpecial from './Img/commerceAndSpecial.png';

/**
 * 组件库
 * @param {String} name  组件名称
 * @param {ReactDOM} icon  组件图标
 * @param {String} moduleName  组件类型
 * @param {Boolean} drop 是否可拖拽 如果是不可拖拽的模块 全局唯一只能存在一个
 * @param {ReactDOM} defaultImg 拖拽后默认显示占位图片
 * @param {ReactDOM} defaultData 默认数据
 * @param {Boolean} editFormFlag 是否存在编辑表单
 */
export default {
  commerceAndSpecial: {
    name: '电商品+特惠品',
    icon: <PictureOutlined style={{ fontSize: 24 }} />,
    drop: true,
    defaultImg: commerceAndSpecial,
  },
  trigonometry: {
    name: '三宫格',
    icon: <PictureOutlined style={{ fontSize: 24 }} />,
    drop: true,
    defaultImg: trigonometry,
  },
  seasonalKeyAndBicuspidLattice: {
    name: '应季主打+二宫格',
    icon: <PictureOutlined style={{ fontSize: 24 }} />,
    drop: true,
    defaultImg: seasonalKeyAndBicuspidLattice,
  },
  strollAroundMainBannerBigpicture: {
    name: '主banner-大图',
    icon: <PictureOutlined style={{ fontSize: 24 }} />,
    drop: true,
    defaultImg: strollAroundMainBannerBigpicture,
  },
  topBackground: {
    name: '顶部背景',
    icon: <PictureOutlined style={{ fontSize: 24 }} />,
    drop: false,
    editFormFlag: true,
    defaultData: { height: 400 },
  },
  spaceOccupyingLattice: {
    name: '占位格',
    icon: <PictureOutlined style={{ fontSize: 24 }} />,
    drop: true,
    editFormFlag: true,
    defaultData: { height: 10 },
  },
  beanBalance: {
    name: '卡豆余额',
    icon: <PictureOutlined style={{ fontSize: 24 }} />,
    drop: true,
    defaultImg: beanRemaining,
  },
  mainBanner: {
    name: '主banner位',
    icon: <PictureOutlined style={{ fontSize: 24 }} />,
    drop: true,
    defaultImg: mainBanner,
    // editFormFlag: true,
  },
  signInModule: {
    name: '签到入口',
    icon: <PictureOutlined style={{ fontSize: 24 }} />,
    drop: true,
    defaultImg: signInModule,
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
    editFormFlag: true,
  },
  limitedTimeAndExplosive: {
    name: '限时+爆品',
    icon: <PictureOutlined style={{ fontSize: 24 }} />,
    drop: true,
    defaultImg: limitedTimeAndExplosive,
    editFormFlag: true,
  },
  limitedTime: {
    name: '限时抢购',
    icon: <PictureOutlined style={{ fontSize: 24 }} />,
    drop: true,
    defaultImg: limitedTime,
    editFormFlag: true,
  },
  explosive: {
    name: '爆品福利',
    icon: <PictureOutlined style={{ fontSize: 24 }} />,
    drop: true,
    defaultImg: explosive,
    editFormFlag: true,
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
    editFormFlag: true,
  },
  specialRecommend: {
    name: '特惠推荐',
    icon: <PictureOutlined style={{ fontSize: 24 }} />,
    drop: true,
    defaultImg: specialRecommend,
    editFormFlag: true,
  },
  selfTourResource: {
    name: '自我游',
    icon: <PictureOutlined style={{ fontSize: 24 }} />,
    drop: true,
    defaultImg: selfTourResource,
    editFormFlag: true,
  },
  newProductRecommend: {
    name: '新品推荐',
    icon: <PictureOutlined style={{ fontSize: 24 }} />,
    drop: true,
    defaultImg: newProductRecommend,
    editFormFlag: true,
  },
  commerceGoods: {
    name: '电商品',
    icon: <PictureOutlined style={{ fontSize: 24 }} />,
    drop: true,
    defaultImg: commerceGoods,
    editFormFlag: true,
  },
  beanEducation: {
    name: '四宫格',
    icon: <PictureOutlined style={{ fontSize: 24 }} />,
    drop: true,
    defaultImg: beanEducation,
  },
  sixPalaceLattice: {
    name: '六宫格',
    icon: <PictureOutlined style={{ fontSize: 24 }} />,
    drop: true,
    defaultImg: sixPalaceLattice,
  },
  specialAndSelfTourAndCommerce: {
    name: '特惠+自我游+电商品',
    icon: <PictureOutlined style={{ fontSize: 24 }} />,
    drop: true,
    defaultImg: specialAndSelfTourAndCommerce,
    editFormFlag: true,
  },
  selfTourAndCommerce: {
    name: '自我游+电商品',
    icon: <PictureOutlined style={{ fontSize: 24 }} />,
    drop: true,
    defaultImg: selfTourAndCommerce,
    editFormFlag: true,
  },
  beanDeductionZone: {
    name: '卡豆超值抵扣专区',
    icon: <PictureOutlined style={{ fontSize: 24 }} />,
    drop: true,
    defaultImg: beanDeductionZone,
  },
  fieldResource: {
    name: '田字资源位',
    icon: <PictureOutlined style={{ fontSize: 24 }} />,
    drop: true,
    defaultImg: fieldResource,
  },
  timeLimitedCoupon: {
    name: '限时神券',
    icon: <PictureOutlined style={{ fontSize: 24 }} />,
    drop: true,
    defaultImg: timeLimitedCoupon,
    editFormFlag: true,
  },
  limitedTimeHotMixing: {
    name: '限时热兑',
    icon: <PictureOutlined style={{ fontSize: 24 }} />,
    drop: true,
    defaultImg: limitedTimeHotMixing,
    editFormFlag: true,
  },
  userParticipation: {
    name: '拼好货',
    icon: <PictureOutlined style={{ fontSize: 24 }} />,
    drop: true,
    defaultImg: userParticipation,
  },
};
