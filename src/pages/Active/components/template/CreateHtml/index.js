/**
 * 新建html文件
 */
import native from './native';
import showHtml from './showHtml';

// script
const scriptTag = (text) => `<script>${text}</script>`;

const scriptProxy = `function renderByToken (){
  this.tokenObj = {};
  this.render = null;
  this.getUrlKey = (name) => {
      return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
  }
  this.initToken = () => {
      let that = this
      if(new nativeOther().getPhone() ==='miniProgram'){
          that.tokenObj.token = val
      } else {
          native.nativeInit('getToken', {}, (val) => {
              if (val && val.length > 0) {

                  that.tokenObj.token = val
              }
              else {
                  that.tokenObj.token = val
              }
          })
      }
  }
  this.initProxy =  () => {
       let that = this
       that.tokenObj = new Proxy({},{
          get: function(target, p, receiver) {

          },
          set: function(target, p, value, receiver) {
              console.log(target,p,value)
               that.render && that.render(value)
          }
      })
  }
  this.init = (render = () => {}) => {
      this.render = render
      this.initProxy();
      this.initToken()

  }
};

let a =  new renderByToken()
a.init((e) => {console.log(e)})`;

// 赚多少
export const computedPrice = (price, scale) => {
  let size = (price * (scale / 100)).toFixed(3);
  size = size.substring(0, size.length - 1);
  if (size === '0.00') {
    return 0.01;
  } else return size;
};

// // 卡豆省后商品最低价格
// export const computedBeanPrice = (price, scale) => {
//   let size = (price * (1 - scale / 100)).toFixed(2);
//   if (size === '0.00') {
//     return 0.01;
//   } else return size;
// };

const init = (htmlData = {}) => {
  const { dataList, backgroundColor, activityName } = htmlData;
  // 网页头部
  const htmlHeard = `<!DOCTYPE html><html lang="en"><head>
  <meta charset="UTF-8"/>
  <meta http-equiv="X-UA-Compatible"content="IE=edge"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no,minimal-ui, viewport-fit=cover"/>
  <title>${activityName}</title>
  <style>*{box-sizing:border-box;font-family: PingFang SC;}html,body{background-color:${backgroundColor};width:100vw;height:100%;margin:0;padding:0;line-height: 1;-webkit-overflow-scrolling: touch;}</style>
  <script type="text/javascript" src="https://res.wx.qq.com/open/js/jweixin-1.3.2.js"></script>
  ${scriptTag(native)}
  </head><body>`;
  const carousealLink = `
  <link rel="stylesheet" href="https://unpkg.com/swiper/swiper-bundle.min.css">
  <script src="https://unpkg.com/swiper/swiper-bundle.min.js"> </script>`;
  const carousealScript = `var mySwiper = new Swiper('.swiper-container', {autoplay:true, loop: true})`;
  let carousealCheck = false;

  // 网页内容组件
  const bodyContent = dataList
    .map((item) => {
      const { editorType, data } = item;
      if (editorType === 'carouseal') carousealCheck = true;
      if (typeof data.styleIndex === 'number') {
        return scriptTag(
          `(${showHtml[editorType](data.styleIndex).toString()})(${JSON.stringify(data.list)})`,
        );
      } else {
        return scriptTag(`(${showHtml[editorType].toString()})(${JSON.stringify(data)})`);
      }
    })
    .join('');
  // 网页底部
  const htmlFooter = `</body>${carousealCheck ? scriptTag(carousealScript) : ''}</html>`;
  return htmlHeard + (carousealCheck ? carousealLink : '') + bodyContent + htmlFooter;
};

export default init;
