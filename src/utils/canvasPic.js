/**
 * 绘制一个图片。
 */
const makeImage = (options, callback) => {
  const { parts, width, height } = options;
  let error = null;

  // 初始化Canvas
  const canvas = document.createElement('canvas');
  const mainCtx = canvas.getContext('2d');
  canvas.width = width;
  canvas.height = height;
  mainCtx.fillStyle = options.background || '#fff';
  mainCtx.fillRect(0, 0, width, height);
  mainCtx.save();

  /**
   * 设置宽高，针对负值定位做处理
   * @param {number} x: positionX
   * @param {number} y: positionY
   * @param {object} o: width & height
   * @param {number} o.width: 文字的宽度
   * @param {number} o.height: 文字的高度
   * @param {number} o.lineAlign: 文字的垂直对齐方式
   * @param {number} o.lineNum: 文字的行数
   * */
  function setPosition(x, y, o) {
    let positionX, positionY;

    // 处理padding 与 负定位
    if (x < 0) {
      positionX = options.width + x - o.width;
    }

    // 处理padding 与 负定位
    if (y < 0) {
      positionY = options.height + y - o.height;
    }

    positionX = positionX || x || 0;
    positionY = positionY || y || 0;
    // 文字的垂直对齐方式处理
    if (o.lineAlign === 'middle') {
      positionY -= (o.height / 2) * o.lineNum - options.height / 2;
    } else if (o.lineAlign === 'bottom') {
      positionY -= o.height * o.lineNum - options.height;
    }

    // 文字的水平对齐方式处理
    if (o.textAlign === 'center') {
      positionX -= o.width / 2 - options.width / 2;
    } else if (o.textAlign === 'right') {
      positionX -= o.width - options.width;
    }

    return {
      x: positionX,
      y: positionY,
    };
  }

  /**
   * 针对圆角做处理
   * */
  function tailorImg(x, y, w, h, r) {
    /**
     * beginPath 与 closePath来关闭绘制圆，以免影响后续绘制，
     * 因为不关闭绘制，会导致后续图片全部倍遮挡.
     * */
    mainCtx.save();
    mainCtx.beginPath();
    mainCtx.moveTo(x + r, y);
    mainCtx.arcTo(x + w, y, x + w, y + h, r);
    mainCtx.arcTo(x + w, y + h, x, y + h, r);
    mainCtx.arcTo(x, y + h, x, y, r);
    mainCtx.arcTo(x, y, x + w, y, r);
    mainCtx.clip();
    mainCtx.closePath();
  }

  function handleTailorImg(options) {
    const {
      image: img,
      x,
      y,
      width: w,
      height: h,
      radius: r,
      padding: p,
      background: bg,
      clipOptions,
    } = options;

    // tailorImg中save保存当前画布，restore将保存的画布重新绘制
    tailorImg(x - p, y - p, w, h, r);
    mainCtx.fillStyle = bg || '#fff';
    mainCtx.fill();
    mainCtx.restore();

    tailorImg(x, y, w - p * 2, h - p * 2, r);
    // 针对非同比例的图片进行部分剪裁
    if (clipOptions) {
      clipOptions.x = clipOptions.x || 0;
      clipOptions.y = clipOptions.y || 0;

      // 缩放图片，方便截取选区
      if (clipOptions.zoom) {
        let dw,
          dh,
          offset = 0;
        if (img.height > img.width) {
          dw = w - p * 2;
          dh = (img.height * w) / img.width - p * 2;
        } else {
          dw = (img.width * h) / img.height - p * 2;
          dh = h - p * 2;
        }
        // 裁剪居中偏移量
        if (clipOptions.align === 'center') {
          offset = Math.abs((dw - dh) / 2);
        }

        mainCtx.drawImage(
          img,
          x - clipOptions.x - (dw > dh ? offset : 0),
          y - clipOptions.y - (dh > dw ? offset : 0),
          dw,
          dh,
        );
      } else {
        if (clipOptions.align === 'center') {
          const offsetX = Math.abs((img.width - w - p) / 2);
          const offsetY = Math.abs((img.height - h - p) / 2);
          mainCtx.drawImage(img, x - offsetX, x - offsetY);
        } else {
          mainCtx.drawImage(img, x - clipOptions.x, y - clipOptions.y);
        }
      }
    } else {
      mainCtx.drawImage(img, x, y, w - p * 2, h - p * 2);
    }
    mainCtx.restore();
  }

  /**
   * 绘制处理各类数据
   * @param {object} options: 绘制对象的配置
   * @param {function} nextFunc: 下步的回调，是继续，还是执行成功回调
   * */
  function handleText(options, nextFunc) {
    const bodyStyle = getComputedStyle(document.body);

    // 没有任何文本内容直接跳出
    if (!options.text || typeof options.text !== 'string') return nextFunc();

    const arr = options.text.toString().split('\n');

    // 设置字体后，再获取图片的宽高
    const lineHeight = parseFloat(options.size || bodyStyle.fontSize) * 1.2;

    for (let i = 0, lineNum = arr.length; i < lineNum; i++) {
      // 设置字体
      mainCtx.textBaseline = 'top';
      mainCtx.font = `${options.bold ? `bold ` : ''}${options.size || bodyStyle.fontSize} ${
        bodyStyle.fontFamily
      }`;
      mainCtx.fillStyle = options.color || bodyStyle.color;

      // 设置文本对齐方式
      mainCtx.textAlign = 'left';

      // 设置透明度
      mainCtx.globalAlpha = options.opacity || 1;
      const position = setPosition(options.x || 0, (options.y || 0) + lineHeight * i, {
        lineNum, // 处理lineAlign
        lineAlign: options.lineAlign,
        textAlign: options.textAlign,
        height: lineHeight,
        width: mainCtx.measureText(arr[i]).width,
      });

      mainCtx.fillText(arr[i], position.x, position.y);
    }

    // 最后一个元素时，便执行回调,否则继续绘制
    nextFunc && nextFunc();
  }

  function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

  function handleImage(options = {}, nextFunc) {
    const { width, height, x, y, url } = options;
    if (!url) return console.error('缺失绘制的图片 url');
    const padding = options.padding || 0;
    const img = new Image();
    const position = setPosition(x, y, { width, height });

    img.crossOrigin = 'anonymous';
    // 兼容问题：base64需要特殊处理
    img.src = !~url.indexOf('data:image/') ? url : URL.createObjectURL(dataURItoBlob(url));

    // 加载完成，绘制至画布
    img.onerror = (err) => {
      error = err;

      // 最后一个元素时，便执行回调,否则继续绘制,
      nextFunc && nextFunc();
    };

    img.onload = () => {
      // 设置透明度
      mainCtx.globalAlpha = options.opacity || 1;

      if (options.radius || padding > 0) {
        handleTailorImg({
          image: img,
          x: position.x + padding,
          y: position.y + padding,
          width: width || img.width,
          height: height || img.height,
          radius: (((height || img.height) - 2 * padding) / 2) * (options.radius || 0),
          padding,
          background: options.background,
          clipOptions: options.clipOptions,
        });
      } else {
        mainCtx.drawImage(
          img,
          position.x + padding,
          position.y + padding,
          (width || img.width) - padding * 2,
          (height || img.height) - padding * 2,
        );
      }

      // 最后一个元素时，便执行回调,否则继续绘制,
      nextFunc && nextFunc();
    };
  }

  // 初始化数据
  let len = parts.length;
  let i = 0;

  const start = function () {
    /**
     * 最后一个元素时，便执行回调,否则继续绘制
     * @param {number} opacity: 绘制的透明度，默认为 0
     * */
    const nextFunc = () => {
      i++;
      // 是否最后一个绘制对西那个
      !(len - i)
        ? callback && callback(error, canvas.toDataURL('image/jpeg', options.compress || 0.8))
        : start();
    };

    if (len - i) {
      switch (parts[i].type) {
        case 'text':
          handleText(parts[i], nextFunc);
          break;
        case 'image':
          handleImage(parts[i], nextFunc);
          break;
        default:
      }
    }
  };
  start();
};

export default makeImage;
