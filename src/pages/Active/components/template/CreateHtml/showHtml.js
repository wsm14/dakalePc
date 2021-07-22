import commonList1 from './CommonList';

let head = {}; // [key]: value[]
const body = [];
let footer = {}; // [key]: value

// 请求方法
const requestJs = [
  "<style>.loading{position:fixed;top:0;left:0;right:0;bottom:0;display:flex;justify-content:center;align-items:center;z-index:100;background:rgba(255,255,255,0);}.loadingbg{width:100px;height:100px;display:flex;justify-content:center;align-items:center;border-radius:4px;background: #0000002b;}.pull_load{width:100%;padding:20px 20px;text-align:center;font-size:20px;color:#333333;}.loading_icon{display:inline-block;vertical-align:middle;background:url('https://web-new.dakale.net/public/image/load.png')no-repeat;background-size:100%100%;width:32px;height:32px}.animateload{position:relative;animation-name:loadingpush;animation-duration:10000ms;animation-timing-function:linear;animation-iteration-count:infinite;}@-webkit-keyframes loadingpush{from{transform:rotateZ(0deg)}to{transform:rotateZ(3600deg)}}</style>",
  "<script src='https://resource-new.dakale.net/admin/activeJs/zepto.min.js'></script>",
  "<script src='https://resource-new.dakale.net/admin/activeJs/axios.min.js'></script>",
  "<script src='https://resource-new.dakale.net/admin/activeJs/md5.min.js'></script>",
  "<script src='https://resource-new.dakale.net/admin/activeJs/request.js'></script>",
];

// script 标签
const scriptTag = (dom, data) => `<script>(${dom.toString()})(${JSON.stringify(data)})<\/script>`;

const htmlDom = {
  // 单张图片
  solaImg: (data) => {
    const dom = ({ img, linkType, url, path }) => {
      document.body.innerHTML += `<img src="${img}" data-linkType="${linkType}" data-path="${
        url || path
      }" style="width: 100vw;display: block;" onclick="handleGoNative(this)"></img>`;
    };

    return scriptTag(dom, data);
  },

  // 轮播图片
  carouseal: ({ list }) => {
    const swiperLink = [
      "<link rel='stylesheet' href='https://unpkg.com/swiper/swiper-bundle.min.css'>",
      "<script src='https://unpkg.com/swiper/swiper-bundle.min.js'></script>",
    ];
    const swiperFooter = `<script>var mySwiper = new Swiper('.swiper-container',{autoplay:true,loop:true,pagination:{el:'.swiper-pagination'}})</script>`;
    head = { ...head, swiper: swiperLink };
    footer = { ...footer, swiper: swiperFooter };
    const dom = (list) => {
      document.body.innerHTML += `<div class="swiper-container"><div class="swiper-wrapper">${list
        .map(
          ({ img, linkType, url, path }) =>
            `<div class="swiper-slide"><img src="${img}" data-linkType="${linkType}" data-path="${
              url || path
            }" style="width: 100%;display: block;" onclick="handleGoNative(this)"></img></div>`,
        )
        .join('')}</div><div class="swiper-pagination"></div></div>`;
    };
    return scriptTag(dom, list);
  },

  // 商品列表
  commonList: ({ styleIndex, list }) => {
    head = { ...head, request: requestJs };
    const functionIndex = [commonList1][styleIndex];
    return `<script>;(${functionIndex})(${JSON.stringify(list)})<\/script>`;
  },
};

const createHtml = (data = []) => {
  data
    .filter((i) => i.data)
    .forEach(({ editorType, data }) => {
      body.push(htmlDom[editorType](data));
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
