// 生成canvas
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

/**
 * 图片压缩
 * @param {*} files 本地文件流
 * @param {*} return 返回Promise对象 .then返回压缩后的 blob对象 base64对象
 */
const imageCompress = (files) => {
  let fileblob = {};
  let base64 = '';
  return new Promise((resolve) => {
    const fr = new FileReader();
    fr.readAsDataURL(files);
    fr.onload = () => {
      const img = new Image();
      img.src = fr.result;
      img.onload = () => {
        // 默认按比例压缩
        const w = img.width;
        const h = img.height;

        // 创建属性节点
        const anw = document.createAttribute('width');
        anw.nodeValue = w;
        const anh = document.createAttribute('height');
        anh.nodeValue = h;
        canvas.setAttributeNode(anw);
        canvas.setAttributeNode(anh);
        ctx.drawImage(img, 0, 0, w, h);

        // 值越小，所绘制出的图像越模糊 默认 0.7
        base64 = canvas.toDataURL(files.type || 'image/jpeg', 0.7);
        //  console.log(`压缩后：${base64.length / 1024}kb`);
        // base64转换blob
        const arr = base64.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        // eslint-disable-next-line no-plusplus
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        fileblob = new Blob([u8arr], { type: mime });
        const file = new File([fileblob], files.name, { type: mime }); // 后台需要文件名 转换回来
        resolve({ file, blob: fileblob, base64 });
      };
    };
  });
};

export default imageCompress;
