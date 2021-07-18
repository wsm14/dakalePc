/**
 * 新建html文件
 */
import showHtml from './showHtml';

// script
const scriptTag = (text) => `<script>${text}</script>`;

const testData = {
  backgroundColor: '#f00b0b',
  dataList: [
    {
      id: 1626616577722,
      index: 0,
      editorType: 'solaImg',
      name: '单张图片',
      drop: true,
      data: {
        img: 'https://resource-new.dakale.net/dev/image/a907ea44-7c42-4ce3-9812-dd9deae36250.jpg',
        editorType: 'solaImg',
      },
    },
    {
      id: 1626616587048,
      index: 1,
      editorType: 'commonList',
      name: '商品列表',
      drop: true,
      data: {
        styleIndex: 0,
        list: [
          {
            activityEndTime: '',
            activityStartTime: '',
            activityTimeRule: 'infinite',
            goodsImg:
              'https://resource-new.dakale.net/dev/image/1edfa57711200a22c5ad6a006e961f7e.jpg',
            goodsName: '不能那么美女',
            goodsType: 'single',
            oriPrice: '10.00',
            realPrice: '0.05',
            remain: 7,
            specialGoodsId: '1416287245653942273',
            status: '1',
          },
          {
            activityEndTime: '',
            activityStartTime: '',
            activityTimeRule: 'infinite',
            goodsImg:
              'https://resource-new.dakale.net/dev/image/d233a4d17e0c3b199cf1b907d39f48b1.jpg',
            goodsName: '你你你你',
            goodsType: 'single',
            oriPrice: '888.00',
            realPrice: '0.50',
            remain: 2,
            specialGoodsId: '1416312677644279810',
            status: '1',
          },
          {
            activityEndTime: '',
            activityStartTime: '',
            activityTimeRule: 'infinite',
            goodsImg:
              'https://resource-new.dakale.net/dev/image/3c49c893-2f43-4622-9578-40003ce76928.jpg',
            goodsName: '控制在哪',
            goodsType: 'single',
            oriPrice: '99.00',
            realPrice: '88.00',
            remain: 99,
            specialGoodsId: '1415946580474683394',
            status: '1',
          },
          {
            activityEndTime: '',
            activityStartTime: '',
            activityTimeRule: 'infinite',
            goodsImg:
              'https://resource-new.dakale.net/dev/image/1c361cb38b994a0e747db2e253504ecc.jpg',
            goodsName: '测试商家端单品',
            goodsType: 'single',
            oriPrice: '99.00',
            realPrice: '88.00',
            remain: 198,
            specialGoodsId: '1415939110029189122',
            status: '1',
          },
          {
            activityEndTime: '',
            activityStartTime: '',
            activityTimeRule: 'infinite',
            goodsImg:
              'https://resource-new.dakale.net/dev/image/d233a4d17e0c3b199cf1b907d39f48b1.jpg',
            goodsName: '测试服',
            goodsType: 'single',
            oriPrice: '1.00',
            realPrice: '0.03',
            remain: 7,
            specialGoodsId: '1416008901989453825',
            status: '1',
          },
        ],
      },
    },
  ],
};

const init = (htmlData = {}) => {
  const { dataList, backgroundColor } = testData;
  // 网页头部
  const htmlHeard = `<!DOCTYPE html><html lang="en"><head>
  <meta charset="UTF-8"/>
  <meta http-equiv="X-UA-Compatible"content="IE=edge"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no,minimal-ui, viewport-fit=cover"/>
  <title>Document</title>
  <style>*{box-sizing:border-box;}html,body{background-color:${backgroundColor};width:100vw;height:100%;margin:0;padding:0;line-height: 1;-webkit-overflow-scrolling: touch;}</style>
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
  return (
    htmlHeard +
    scriptTag(`function handleGoNative(e) {
    let keyObj = {};
    e.getAttribute("data-key").split(',').map(item => {
      keyObj[item] = e.getAttribute("data-"+item)
    })
    }`) +
    bodyContent +
    htmlFooter
  );
};

export default init;
