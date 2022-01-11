/**
 * 新建html文件
 */
import createHtml from './showHtml';
import htmlDefault from './htmlDefault';

const init = (htmlData = {}) => {
  console.log(htmlData);
  const { dataList, backgroundColor, activityName, share = {}, templateType } = htmlData;

  let { head, body, footer } = createHtml([{ data: share, editorType: 'share' }, ...dataList]);

  return htmlDefault[templateType]({
    activityName,
    backgroundColor,
    head, // 网页头部
    body,
    footer,
  });
};

export default init;
