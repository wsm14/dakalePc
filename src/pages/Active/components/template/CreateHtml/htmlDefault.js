import { nativeText, nativeClick } from './native'; // 桥接文件

export default {
  active: ({ activityName, backgroundColor, head, body, footer }) => {
    return `<!DOCTYPE html><html lang="zh-cmn-Hans">
    <head>
    <meta charset="UTF-8"/>
    <meta http-equiv="X-UA-Compatible"content="IE=edge"/>
    <meta name="viewport" content="width=device-width,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no,minimal-ui, viewport-fit=cover"/>
    <title>${activityName}</title>
    <style>*{box-sizing:border-box;font-family: PingFang SC;}html,body{overflow-x: hidden;background-color:${backgroundColor};width:100vw;height:100%;margin:0;padding:0;line-height: 1.15;-webkit-overflow-scrolling: touch;}</style>
    <script type="text/javascript" src="https://resource-new.dakale.net/admin/activeJs/zepto.min.js"></script>
    <script type="text/javascript" src="https://res.wx.qq.com/open/js/jweixin-1.3.2.js"></script>
    ${head}
    <script>${nativeText}</script>
    </head>
    <body>
    ${body}
    </body>
    ${footer}
    ${nativeClick}
    </html>`;
  },
  rule: ({ activityName, backgroundColor, head, body, footer }) => {
    return `<!DOCTYPE html><html lang="zh-cmn-Hans">
    <head>
    <meta charset="UTF-8"/>
    <meta http-equiv="X-UA-Compatible"content="IE=edge"/>
    <meta name="format-detection" content="telephone=no">
    <meta name="viewport" content="width=device-width,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no,minimal-ui, viewport-fit=cover"/>
    <title>${activityName}</title>
    <style>*{box-sizing:border-box;font-family: PingFang SC;}html,body{overflow-x: hidden;background-color:${backgroundColor};width:100vw;height:100%;margin:0;padding:0;line-height: 1.15;-webkit-overflow-scrolling: touch;}</style>
    ${head}
    </head>
    <body>
    ${body}
    </body>
    ${footer}
    </html>`;
  },
  globalModal: ({ activityName, head, body, footer }) => {
    return `<!DOCTYPE html><html lang="zh-cmn-Hans">
    <head>
    <meta charset="UTF-8"/>
    <meta http-equiv="X-UA-Compatible"content="IE=edge"/>
    <meta name="viewport" content="width=device-width,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no,minimal-ui, viewport-fit=cover"/>
    <title>${activityName}</title>
    <style>*{box-sizing:border-box;font-family:PingFang SC;z-index: 1;}html,body{overflow-x: hidden;display:flex;align-items:center;justify-content:center;flex-direction:column;background:transparent;width:100vw;height:100%;margin:0;padding:0;line-height:1.15;-webkit-overflow-scrolling:touch}.active_toast1{position:absolute;top:0;left:0;right:0;bottom:0;background-color:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;flex-direction:column;z-index:0}.drawer_close_box{width:6.8vw;height:6.8vw;margin:3.4vw auto 0;background-image:url('https://wechat-config.dakale.net/miniprogram/image/icon778.png');background-size:100% 100%}</style>
    <script type="text/javascript" src="https://resource-new.dakale.net/admin/activeJs/zepto.min.js"></script>
    ${head}
    <script>${nativeText}</script>
    </head>
    <body>
    <div class="active_toast1"></div>
    ${body}
    <div class="drawer_close_box"></div>
    </body>
    ${footer}
    <script>
    $("body").on("click",".handleGoNative",function(){var t=this;if($(this).attr("data-linkType")||$(this).attr("data-native")){var a={};($(this).attr("data-key")?$(this).attr("data-key").split(","):[]).map(function(i){a[i]=$(t).attr("data-"+i)});var i=$(this).attr("data-path"),e={path:i,hideCurrent:1,params:a,linkType:$(this).attr("data-linkType")};if("H5"!==$(this).attr("data-linkType")){native.nativeInit($(this).attr("data-native")||"linkTo",e);"dakaleAndroid"===native.getPhone()&&native.nativeInit("close")}else{if(!i)return void alert("未配置url");var n=i.includes("newPage")?i:i.includes("?")?i+"&newPage=true":i+"?newPage=true";if("dakaleIOS"===native.getPhone())try{window.webkit.messageHandlers.finishAndPushH5.postMessage(JSON.stringify({path:n}))}catch(t){e.path=n,native.nativeInit($(this).attr("data-native")||"linkTo",e)}else"dakaleAndroid"===native.getPhone()&&(window.location.href=n,native.nativeInit("close"))}}}),$("body").on("click",".active_toast1",function(){native.nativeInit("close")}),$("body").on("click",".drawer_close_box",function(){native.nativeInit("close")});
    $('body').on('click','.active_toast1',function(){native.nativeInit('close')});$('body').on('click','.drawer_close_box',function(){native.nativeInit('close')});
    </script>
    </html>
    `;
  },
};
