import {
  BgColorsOutlined,
  PictureOutlined,
  ShoppingOutlined,
  ShopOutlined,
  MoneyCollectOutlined,
  VideoCameraAddOutlined,
} from '@ant-design/icons';
import BackgroundColor from './BackgroundColor';
import SolaImg from './SolaImg';
import Carouseal from './Carouseal';
import CommonList from './CommonList';
import NormalVideo from './NormalVideo';
import MerchantList from './MerchantList';
import CouponList from './CouponList';
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
};
