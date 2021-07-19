/**
 * 新建html文件
 */
import native from './native';
import showHtml from './showHtml';

// script
const scriptTag = (text) => `<script>${text}</script>`;

const init = (htmlData = {}) => {
  const { dataList, backgroundColor } = htmlData;
  // 网页头部
  const htmlHeard = `<!DOCTYPE html><html lang="en"><head>
  <meta charset="UTF-8"/>
  <meta http-equiv="X-UA-Compatible"content="IE=edge"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no,minimal-ui, viewport-fit=cover"/>
  <title>Document</title>
  <style>*{box-sizing:border-box;}html,body{background-color:${backgroundColor};width:100vw;height:100%;margin:0;padding:0;line-height: 1;-webkit-overflow-scrolling: touch;}</style>
  <script type="text/javascript" src="https://res.wx.qq.com/open/js/jweixin-1.3.2.js"></script>
  ${scriptTag(native)}
  </head><body>`;
  // 网页底部
  const htmlFooter = '</body></html>';
  // 网页内容组件
  const bodyContent = dataList
    .map((item) => {
      const { editorType, data } = item;
      if (typeof data.styleIndex === 'number') {
        return scriptTag(
          `(${showHtml[editorType](data.styleIndex).toString()})(${JSON.stringify(data.list)})`,
        );
      } else {
        return scriptTag(`(${showHtml[editorType].toString()})(${JSON.stringify(data)})`);
      }
    })
    .join('');
  return htmlHeard + bodyContent + htmlFooter;
};

export default init;
