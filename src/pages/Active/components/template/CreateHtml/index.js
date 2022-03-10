/**
 * 新建html文件
 */
import createHtml from './showHtml';
import htmlDefault from './htmlDefault';
import weChatConfig from './weChatConfig';

const init = (htmlData = {}) => {
  const { dataList, backgroundColor, activityName, share = {}, templateType } = htmlData;

  let { head, body, footer } = createHtml([{ data: share, editorType: 'share' }, ...dataList]);

  head = Object.values(share || {}).length > 0 ? head + `<script>${weChatConfig}</script>` : head;

  return htmlDefault[templateType]({
    activityName,
    backgroundColor,
    head, // 网页头部
    body,
    footer,
  });
};

export default init;
