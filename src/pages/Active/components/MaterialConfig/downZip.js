import JSZip from 'jszip';
import canvasPic from '@/utils/canvasPic';

export const createZip = (data = []) => {
  var zip = new JSZip();

  const whSet = (w, h) => ({ width: w, height: h }); // 宽高
  const textStyle = {
    type: 'text',
    textAlign: 'center',
    color: '#ffffff',
    size: '30px',
    opacity: 0.6,
  };

  data.forEach((obj, index) => {
    const timestamp = new Date().getTime();
    canvasPic(
      {
        parts: [
          {
            type: 'image',
            url: 'https://resource-new.dakale.net/admin/QrCode/paybag2.jpg?' + timestamp,
            ...whSet(1240, 1748),
          },
          {
            type: 'image',
            url: 'https://resource-new.dakale.net/admin/QrCode/paybag2.jpg?' + timestamp,
            ...whSet(773, 773),
            x: 234,
            y: 322,
          },
          {
            ...textStyle,
            text: `${obj.id}${index}`,
            y: 1156,
          },
        ],
        ...whSet(1240, 1748),
      },
      (err, imgData) => {
        // zip包里面不断塞文件 data:image/jpeg;base64
        zip.file(`smile${index}.jpg`, imgData.replace(/^data:image\/(png|jpeg);base64,/, ''), {
          base64: true,
        });
        if (data.length - 1 === index) {
          // 生成zip文件并下载
          zip
            .generateAsync({
              type: 'blob',
            })
            .then(function (content) {
              console.log(content);
              // 下载的文件名
              var filename = 'key' + '.zip';
              // 创建隐藏的可下载链接
              var eleLink = document.createElement('a');
              eleLink.download = filename;
              eleLink.style.display = 'none';
              // 下载内容转变成blob地址
              eleLink.href = URL.createObjectURL(content);
              // 触发点击
              document.body.appendChild(eleLink);
              eleLink.click();
              // 然后移除
              document.body.removeChild(eleLink);
            });
        }
      },
    );
  });
};

export const handleZipDown = (name, content) => {
  // 下载的文件名
  var filename = name + '.zip';
  // 创建隐藏的可下载链接
  var eleLink = document.createElement('a');
  eleLink.download = filename;
  eleLink.style.display = 'none';
  // 下载内容地址
  eleLink.href = content;
  // 触发点击
  document.body.appendChild(eleLink);
  eleLink.click();
  // 然后移除
  document.body.removeChild(eleLink);
};
