import {
  BgColorsOutlined,
  PictureOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  ShopOutlined,
  MoneyCollectOutlined,
  VideoCameraAddOutlined,
  SwapOutlined,
  FormOutlined,
} from '@ant-design/icons';
import BackgroundColor from './BackgroundColor';
import SolaImg from './SolaImg';
import GlobalModalSolaImg from './GlobalModalSolaImg';
import Carouseal from './Carouseal';
import Share from './Share';
import CommonList from './CommonList';
import CommerceGoods from './CommerceGoods';
import NormalVideo from './NormalVideo';
import MerchantList from './MerchantList';
import CouponList from './CouponList';
import GlobalModalPlatformCoupon from './GlobalModalPlatformCoupon';
import RichText from './RichText';
import img from './Img/img.png';
import list from './Img/list.png';
import mrelist from './Img/mrelist.png';

/**
 * 组件库
 * @param {String} name  组件名称
 * @param {ReactDOM} icon  组件图标
 * @param {String} editorType  组件类型
 * @param {Boolean} drop 是否可拖拽
 * @param {ReactDOM} defaultImg 拖拽后默认显示占位图片
 * @param {any} defaultData 表单默认值 null
 * @param {ReactDOM} editor 详细组件编辑容器 ({ cRef, editorType 组件type, value 原值 })
 */
export default {
  backgroundColor: {
    name: '背景颜色',
    icon: <BgColorsOutlined style={{ fontSize: 24 }} />,
    editorType: 'backgroundColor',
    drop: false,
    editorDom: (props) => <BackgroundColor {...props}></BackgroundColor>,
  },
  share: {
    name: '分享配置',
    icon: <SwapOutlined style={{ fontSize: 24 }} />,
    editorType: 'share',
    drop: false,
    editorDom: (props) => <Share {...props}></Share>,
  },
  solaImg: {
    name: '单张图片',
    icon: <PictureOutlined style={{ fontSize: 24 }} />,
    editorType: 'solaImg',
    drop: true,
    defaultImg: img,
    editorDom: (props) => <SolaImg {...props}></SolaImg>,
    dom: (props) => SolaImg.dom(props),
  },
  carouseal: {
    name: '轮播图片',
    icon: <PictureOutlined style={{ fontSize: 24 }} />,
    editorType: 'carouseal',
    drop: true,
    defaultImg: img,
    editorDom: (props) => <Carouseal {...props}></Carouseal>,
    dom: (props) => Carouseal.dom(props),
  },
  commonList: {
    icon: <ShoppingOutlined style={{ fontSize: 24 }} />,
    name: '商品列表',
    editorType: 'commonList',
    drop: true,
    defaultImg: list,
    defaultData: { styleIndex: 0, list: [] },
    editorDom: (props) => <CommonList {...props}></CommonList>,
    dom: (props) => CommonList.dom(props),
  },
  commerceGoods: {
    icon: <ShoppingCartOutlined style={{ fontSize: 24 }} />,
    name: '电商品列表',
    editorType: 'commerceGoods',
    drop: true,
    defaultImg: list,
    defaultData: { styleIndex: 0, list: [] },
    editorDom: (props) => <CommerceGoods {...props}></CommerceGoods>,
    dom: (props) => CommerceGoods.dom(props),
  },
  merchantList: {
    icon: <ShopOutlined style={{ fontSize: 24 }} />,
    name: '店铺列表',
    editorType: 'merchantList',
    drop: true,
    defaultImg: mrelist,
    defaultData: { styleIndex: 0, list: [] },
    editorDom: (props) => <MerchantList {...props}></MerchantList>,
    dom: (props) => MerchantList.dom(props),
  },
  couponList: {
    icon: <MoneyCollectOutlined style={{ fontSize: 24 }} />,
    name: '券列表',
    editorType: 'couponList',
    drop: true,
    defaultImg: list,
    defaultData: { styleIndex: 0, list: [] },
    editorDom: (props) => <CouponList {...props}></CouponList>,
    dom: (props) => CouponList.dom(props),
  },
  normalVideo: {
    icon: <VideoCameraAddOutlined style={{ fontSize: 24 }} />,
    name: '视频',
    editorType: 'normalVideo',
    drop: true,
    defaultImg: img,
    defaultData: '',
    editorDom: (props) => <NormalVideo {...props}></NormalVideo>,
    dom: (props) => NormalVideo.dom(props),
  },
  richText: {
    name: '富文本',
    icon: <FormOutlined style={{ fontSize: 24 }} />,
    editorType: 'richText',
    drop: true,
    defaultImg: img,
    editorDom: (props) => <RichText {...props}></RichText>,
    dom: (props) => RichText.dom(props),
  },
  globalModalPlatformCoupon: {
    icon: <MoneyCollectOutlined style={{ fontSize: 24 }} />,
    name: '平台券', // 全局弹窗使用
    editorType: 'globalModalPlatformCoupon',
    drop: false,
    only: true,
    defaultData: {
      coupon_bag: 'https://resource-new.dakale.net/admin/image/globalModal/coupon_bag.png',
      box_head:
        'https://resource-new.dakale.net/admin/image/globalModal/globalModal_coupon_head.png',
      box_bag1: '#fffced',
      box_bag2: '#ffebd6',
      box_title: 'https://resource-new.dakale.net/admin/image/globalModal/coupon_title.png',
      title_width: '540',
      coupon_get: 'https://resource-new.dakale.net/admin/image/globalModal/coupon_btn.png',
      coupon_end: 'https://resource-new.dakale.net/admin/image/globalModal/coupon_btnend.png',
      btn_width: '400',
      btn_height: '80',
      list: [],
    },
    editorDom: (props) => <GlobalModalPlatformCoupon {...props}></GlobalModalPlatformCoupon>,
    dom: (props) => GlobalModalPlatformCoupon.dom(props),
  },
  globalModalSolaImg: {
    name: '单张图片', // 全局弹窗使用
    icon: <PictureOutlined style={{ fontSize: 24 }} />,
    editorType: 'globalModalSolaImg',
    drop: false,
    only: true,
    editorDom: (props) => <GlobalModalSolaImg {...props}></GlobalModalSolaImg>,
    dom: (props) => GlobalModalSolaImg.dom(props),
  },
};
