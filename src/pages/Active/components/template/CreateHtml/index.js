/**
 * 新建html文件
 */
import native from './native'; // 桥接文件
import createHtml from './showHtml';

const init = (htmlData = {}) => {
  console.log(htmlData);
  const { dataList, backgroundColor, activityName, share = {}, templateType } = htmlData;

  const { head, body, footer } = createHtml([{ data: share, editorType: 'share' }, ...dataList]);

  // 网页头部
  const htmlHeard = `<!DOCTYPE html><html lang="zh-cmn-Hans"><head>
  <meta charset="UTF-8"/>
  <meta http-equiv="X-UA-Compatible"content="IE=edge"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no,minimal-ui, viewport-fit=cover"/>
  <title>${activityName}</title>
  <style>*{box-sizing:border-box;font-family: PingFang SC;}html,body{background-color:${backgroundColor};width:100vw;height:100%;margin:0;padding:0;line-height: 1.15;-webkit-overflow-scrolling: touch;}</style>
  ${
    templateType !== 'rule'
      ? `<script type="text/javascript" src="https://resource-new.dakale.net/admin/activeJs/zepto.min.js"></script>
    <script type="text/javascript" src="https://res.wx.qq.com/open/js/jweixin-1.3.2.js"></script>`
      : ''
  }
  ${head}
  ${templateType !== 'rule' ? `<script>${native}</script>` : ''}
  </head><body>`;

  return (
    htmlHeard +
    body +
    `</body>${footer}
   ${
     templateType !== 'rule'
       ? `<script>$('body').on('click','.handleGoNative',function(){if(!$(this).attr('data-linkType')&&!$(this).attr('data-native'))return;let keyObj={};($(this).attr('data-key')?$(this).attr('data-key').split(','):[]).map((item)=>{keyObj[item]=$(this).attr('data-'+item)});const path=$(this).attr('data-path');const params={path,params:keyObj,linkType:$(this).attr('data-linkType'),};native.nativeInit($(this).attr('data-native')||'linkTo',params)})</script>`
       : ''
   }
  </html>`
  );
};

export default init;
