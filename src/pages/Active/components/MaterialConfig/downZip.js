import { notification } from 'antd';
import JSZip from 'jszip';
import QRCode from 'qrcode';
import canvasPic from '@/utils/canvasPic';

// 商家不同码参数显示
const mreCodeProps = {
  pay: {
    name: '支付营销码-',
    url: 'https://www.dakale.net?action=pay&enviroment=product&merchantId=',
  },
  daka: {
    name: '打卡营销码-',
    url: 'https://www.dakale.net?action=mark&enviroment=product&merchantId=',
  },
};

// tab不同码参数显示
const tabTypeProps = {
  merchant: {
    key: 'merchantName',
    nameKey: 'merchantName',
  },
  user: {
    key: 'mobile',
    nameKey: 'username',
  },
};

// 获取二维码数据
async function generateQR(text, width) {
  let url;
  await QRCode.toDataURL(text, { width, margin: 0 }).then((res) => {
    url = res;
  });
  return url;
}

// 去除名称重复数据
const unique = (arr, key) => {
  const res = new Map();
  return arr.filter((arr) => !res.has(arr[key]) && res.set(arr[key], 1));
};

export const createZip = (data, tabKey, setPercent, callback) => {
  const zip = new JSZip();
  /**
   * userObjectList 用户数据 { id,mobile,username,userQRCode }
   * merchantObject 商家数据 { id,merchantName }
   * templateImg 背景图片
   * img[Object] 背景图片 height width
   * code[Object] 二维码 width y 上边距 x 左边距
   * codeType 下载内容 tabKey 为 merchant 时存在 pay 支付营销码 daka 打卡营销码
   */
  const {
    userObjectList,
    merchantObject,
    templateImg,
    code = {},
    img = {},
    name = {},
    codeType,
    ...ohter
  } = data;
  // 获取不同类型进入渲染的区别项
  const typeProps = tabTypeProps[tabKey];

  const arr = userObjectList || merchantObject || [];

  const dataList = unique(arr, typeProps.key);

  // 重复数据检查
  if (dataList.length !== arr.length) {
    notification.info({
      message: '警告',
      description: `存在 ${arr.length - dataList.length} 条数据名称相同，请排查`,
    });
    setPercent({ show: false, percent: 0 });
    return;
  }

  // 遍历项目
  dataList.forEach(async (obj, index) => {
    // 显示进度条
    setTimeout(() => {
      setPercent({
        show: true,
        percent: Math.floor(((index + 1) / dataList.length) * 100 * 100) / 100,
      });
    }, 100);

    let codeGet = obj.userQRCode; // 用户二维码
    let fileName = obj[typeProps.key]; // 用户手机号
    const nameText = obj[typeProps.nameKey]; // 名称

    const textStyle = {
      textAlign: 'center',
    };
    // 商家码数据
    if (tabKey === 'merchant') {
      fileName = mreCodeProps[codeType].name + fileName;
      codeGet = await generateQR(mreCodeProps[codeType].url + obj.userMerchantIdString, code.width);
    }
    // 绘制图片
    canvasPic(
      {
        ...img,
        parts: [
          { type: 'image', url: templateImg, ...img },
          { type: 'image', url: codeGet, height: code.width, ...code },
          { type: 'text', ...textStyle, text: nameText, ...name, size: `${name.size}px` },
        ],
      },
      (err, imgData) => {
        // zip包里面不断塞文件 data:image/jpeg;base64
        zip.file(`${fileName}.jpg`, imgData.replace(/^data:image\/(png|jpeg);base64,/, ''), {
          base64: true,
        });
        // 确认数据完整后返回zip包 生成zip文件
        if (dataList.length === Object.keys(zip.files).length) {
          zip.generateAsync({ type: 'blob' }).then((content) => {
            callback(content, ohter);
          });
        }
      },
    );
  });
};

// 下载文件
export const handleZipDown = (content) => {
  // 创建隐藏的可下载链接
  var eleLink = document.createElement('a');
  eleLink.style.display = 'none';
  // 下载内容地址
  eleLink.href = content;
  // 触发点击
  document.body.appendChild(eleLink);
  eleLink.click();
  // 然后移除
  document.body.removeChild(eleLink);
};
