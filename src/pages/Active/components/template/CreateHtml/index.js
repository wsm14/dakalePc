/**
 * 新建html文件
 */
import native from './native'; // 桥接文件
import createHtml from './showHtml';
import htmlDefault from './htmlDefault';

const init = (htmlData = {}) => {
  console.log(htmlData);
  const { dataList, backgroundColor, activityName, share = {}, templateType } = htmlData;

  let { head, body, footer } = createHtml([{ data: share, editorType: 'share' }, ...dataList]);

  if (templateType !== 'rule') {
    head =
      `<script type="text/javascript" src="https://resource-new.dakale.net/admin/activeJs/zepto.min.js"></script>
    <script type="text/javascript" src="https://res.wx.qq.com/open/js/jweixin-1.3.2.js"></script>` +
      head +
      `<script>${native}</script>`;
    footer =
      footer +
      `<script>$('body').on('click','.handleGoNative',function(){if(!$(this).attr('data-linkType')&&!$(this).attr('data-native'))return;let keyObj={};($(this).attr('data-key')?$(this).attr('data-key').split(','):[]).map((item)=>{keyObj[item]=$(this).attr('data-'+item)});const path=$(this).attr('data-path');const params={path,params:keyObj,linkType:$(this).attr('data-linkType'),};native.nativeInit($(this).attr('data-native')||'linkTo',params)})</script>`;
  }

  return htmlDefault[templateType]({
    activityName,
    backgroundColor,
    head, // 网页头部
    body,
    footer,
  });
};

export default init;
