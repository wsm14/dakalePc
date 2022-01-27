import { uuid } from '@/utils/utils';
import share from './Share';
import couponList1 from './CouponList';
import merchantList1 from './MerchantList';
import commonList1 from './CommonList/CommonList_1';
import commonList2 from './CommonList/CommonList_2';
import commonList3 from './CommonList/CommonList_3';
import commerceGoods1 from './CommerceGoods/CommerceGoods_1';
import commerceGoods2 from './CommerceGoods/CommerceGoods_2';
import GlobalModalPlatformCoupon, { couponStyle, userGetCoupon } from './GlobalModalPlatformCoupon';

let head = {}; // [key]: value[]
let footer = {}; // [key]: value

// 请求方法
const requestJs = [
  "<style>.loading{position:fixed;top:0;left:0;right:0;bottom:0;display:flex;justify-content:center;align-items:center;z-index:100;background:rgba(255,255,255,0);}.loadingbg{width:100px;height:100px;display:flex;justify-content:center;align-items:center;border-radius:4px;background: #0000002b;}.pull_load{width:100%;padding:20px 20px;text-align:center;font-size:20px;color:#333333;}.loading_icon{display:inline-block;vertical-align:middle;background:url('https://web-new.dakale.net/public/image/load.png')no-repeat;background-size:100%100%;width:32px;height:32px}.animateload{position:relative;animation-name:loadingpush;animation-duration:10000ms;animation-timing-function:linear;animation-iteration-count:infinite;}@-webkit-keyframes loadingpush{from{transform:rotateZ(0deg)}to{transform:rotateZ(3600deg)}}</style>",
  "<script src='https://resource-new.dakale.net/admin/activeJs/axios.min.js'></script>",
  "<script src='https://resource-new.dakale.net/admin/activeJs/md5.min.js'></script>",
  "<script src='https://resource-new.dakale.net/admin/activeJs/request.js'></script>",
];

// script 标签
const scriptTag = (dom, data, id) =>
  `<script>(${dom.toString()})(${JSON.stringify(data)}, "${id}")<\/script>`;

const richTextStyle = [
  `<style>table{border-top:1px solid#ccc;border-left:1px solid#ccc}table td,table th{padding:3px 5px;border-right:1px solid#ccc;border-bottom:1px solid#ccc}table th{text-align:center;background-color:#f1f1f1;border-bottom:2px solid#ccc}blockquote{display:block;margin:10px 0;padding:5px 10px;font-size:100%;line-height:1.4;background-color:#f1f1f1;border-left:8px solid#d0e5f2}code{display:inline-block;*display:inline;margin:0 3px;padding:3px 5px;background-color:#f1f1f1;border-radius:3px;*zoom:1}pre code{display:block}ul,ol{margin:10px 0 10px 20px}hr{display:block;height:0;margin:20px 0;border:0;border-top:3px solid#ccc}</style>`,
];

const htmlDom = {
  // 分享
  share: (data, uid) => {
    return `<div id="${uid}"></div><script>;(${share})(${JSON.stringify(data)},"${uid}")<\/script>`;
  },
  // 视频
  normalVideo: (data, uid) => {
    const dom = ({ url, poster }, uid) => {
      const vw = (px) => (px / 375) * 100 + 'vw';
      document.getElementById(
        uid,
      ).innerHTML = `<video src="${url}" preload="preload" poster="${poster}" controls="controls" style="width: 100vw;display: block;height: ${vw(
        215,
      )};background-image: url(${poster});background-position: center center;"></video>`;
    };

    return `<div id="${uid}"></div>${scriptTag(dom, data, uid)}`;
  },
  // 单张图片
  solaImg: (data, uid) => {
    const dom = ({ img, linkType, url, path, width, height }, uid) => {
      const vw = (px) => (px / 375) * 100 + 'vw';
      document.getElementById(
        uid,
      ).innerHTML = `<img src="${img}" data-linkType="${linkType}" data-path="${
        url || path
      }" style="width: ${width ? vw(width / 2) : '100vw'};height: ${
        height ? vw(height / 2) : 'auto'
      };display: block;" class="handleGoNative"></img>`;
    };

    return `<div id="${uid}"></div>${scriptTag(dom, data, uid)}`;
  },

  // 轮播图片
  carouseal: ({ list }, uid) => {
    const swiperLink = [
      "<link rel='stylesheet' href='https://unpkg.com/swiper/swiper-bundle.min.css'>",
      "<script src='https://unpkg.com/swiper/swiper-bundle.min.js'></script>",
    ];
    const swiperFooter = `<script>var mySwiper = new Swiper('.swiper-container',{autoplay:true,loop:true,pagination:{el:'.swiper-pagination'}})</script>`;
    head = { ...head, swiper: swiperLink };
    footer = { ...footer, swiper: swiperFooter };
    const dom = (list, uid) => {
      document.getElementById(
        uid,
      ).innerHTML = `<div class="swiper-container" style="position: relative;"><div class="swiper-wrapper">${list
        .map(
          ({ img, linkType, url, path }) =>
            `<div class="swiper-slide"><img src="${img}" data-linkType="${linkType}" data-path="${
              url || path
            }" style="width: 100%;display: block;" class="handleGoNative"></img></div>`,
        )
        .join('')}</div><div class="swiper-pagination"></div></div>`;
    };
    return `<div id="${uid}"></div>${scriptTag(dom, list, uid)}`;
  },

  // 特惠商品列表
  commonList: ({ styleIndex, list }, uid) => {
    head = { ...head, request: requestJs };
    const functionIndex = [commonList1, commonList2, commonList3][styleIndex];
    return `<div id="${uid}"></div><script>;(${functionIndex})(${JSON.stringify(
      list,
    )},"${uid}")<\/script>`;
  },

  // 电商品列表
  commerceGoods: ({ styleIndex, list }, uid) => {
    head = { ...head, request: requestJs };
    const functionIndex = [commerceGoods1, commerceGoods2][styleIndex];
    return `<div id="${uid}"></div><script>;(${functionIndex})(${JSON.stringify(
      list,
    )},"${uid}")<\/script>`;
  },

  // 商家列表
  merchantList: ({ styleIndex, list }, uid) => {
    const functionIndex = [merchantList1][styleIndex];
    return `<div id="${uid}"></div><script>;(${functionIndex})(${JSON.stringify(
      list,
    )},"${uid}")<\/script>`;
  },

  // 券列表
  couponList: ({ styleIndex, list }, uid) => {
    head = { ...head, request: requestJs };
    const functionIndex = [couponList1][styleIndex];
    return `<div id="${uid}"></div><script>;(${functionIndex})(${JSON.stringify(
      list,
    )},"${uid}")<\/script>`;
  },

  // 富文本
  richText: ({ richText, padding }, uid) => {
    head = { ...head, richTextStyle };
    const paddingVw = (padding / 375) * 100 + 'vw';
    return `<div id="${uid}" style="padding: ${paddingVw}">${richText}</div>`;
  },

  // 全局弹窗单图
  globalModalSolaImg: (data, uid) => {
    const dom = ({ img, linkType, url, path, width, height }, uid) => {
      const vw = (px) => (px / 375) * 100 + 'vw';
      document.getElementById(
        uid,
      ).innerHTML = `<img src="${img}" data-linkType="${linkType}" data-path="${
        url || path
      }" style="width: ${width ? vw(width / 2) : '100vw'};height: ${
        height ? vw(height / 2) : 'auto'
      };display: block;" class="handleGoNative"></img>`;
    };

    return `<div id="${uid}"></div>${scriptTag(dom, data, uid)}`;
  },

  // 全局弹窗商品券
  globalModalPlatformCoupon: (
    {
      box_head,
      box_bag1,
      box_bag2,
      coupon_bag,
      box_title,
      title_width,
      coupon_get,
      coupon_end,
      btn_width,
      btn_height,
      list,
    },
    uid,
  ) => {
    head = { ...head, request: requestJs, couponStyle: couponStyle() };
    footer = { ...footer, couponGet: userGetCoupon };
    const vw = (px) => (px / 375) * 100 + 'vw';
    return `
    <div class="globalModal_coupon" style="background: linear-gradient(180deg, ${box_bag1} 0%, ${box_bag2} 100%)">
    <div class="globalModal_coupon_head">
      <img src="${box_head}" style="width: ${vw(270)}; height: ${vw(35)}" />
    </div>
    <div class="globalModal_coupon_title">
      <img src="${box_title}" style="width: ${vw(title_width / 2)}" />
    </div>
    <div class="globalModal_coupon_group">
    <div id="${uid}"></div>
    </div>
    <div class="globalModal_coupon_footer">
      <img id="btnGetCoupon" src="${coupon_get}" style="width: ${vw(btn_width / 2)}; height: ${vw(
      btn_height / 2,
    )}" />
    </div>
    </div>
    <script>;(${GlobalModalPlatformCoupon})(${JSON.stringify(
      list.map((item) => item.platformCouponId),
    )},"${uid}", "${coupon_end}","${coupon_bag}")<\/script>`;
  },
};

const createHtml = (data = []) => {
  let body = [];
  data
    .filter((i) => i.data && Object.values(i.data || {}).length > 0)
    .forEach(({ editorType, data }, index) => {
      const uid = `${uuid()}${index}`;
      body.push(htmlDom[editorType](data, uid));
    });

  return {
    head: Object.values(head)
      .map((i) => i.join(''))
      .join(''),
    body: body.join(''),
    footer: Object.values(footer).join(''),
  };
};

export default createHtml;
