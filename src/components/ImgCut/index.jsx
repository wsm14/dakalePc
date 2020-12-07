import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Cropper from 'react-cropper'; // 引入Cropper
import { RotateLeftOutlined, RotateRightOutlined } from '@ant-design/icons';

import 'cropperjs/dist/cropper.css';

import styles from './index.less';

/**
 * 裁剪图片
 * @uploadedImageFile {*} 裁剪的文件源
 * @onClose 关闭事件
 * @onSubmit 确认裁剪回调
 * @imgRatio 裁剪比例
 */

const ImgCutModal = ({
  uploadedImageFile,
  onClose,
  onSubmit = (file) => console.log(file),
  imgRatio,
  hiddenClose,
}) => {
  ImgCutModal.defaultProps = {
    imgRatio: NaN,
  };

  ImgCutModal.propTypes = {
    uploadedImageFile: PropTypes.any.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    imgRatio: PropTypes.number,
  };

  const [src, setSrc] = useState(null);
  const [cropper, setCropper] = useState();

  useEffect(() => {
    if (uploadedImageFile) {
      if (typeof uploadedImageFile != 'string') {
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
          const dataURL = e.target.result;
          setSrc(dataURL);
        };
        fileReader.readAsDataURL(uploadedImageFile);
      }
      setSrc(uploadedImageFile);
    }
  }, [uploadedImageFile]);

  const handleSubmit = () => {
    const filename = uploadedImageFile;
    // TODO: 这里可以尝试修改上传图片的尺寸
    cropper.getCroppedCanvas().toBlob(async (blob) => {
      // 把选中裁切好的的图片传出去
      const file = new File([blob], filename.name || 'a.jpeg', { type: filename.type });
      onSubmit(file);
      // 关闭弹窗
      onClose(true);
    });
  };

  // 旋转图片
  const rotateImg = (type = 'left') => {
    // console.log('旋转前', cropper.getImageData(), cropper.getCanvasData());
    cropper.rotate(type == 'left' ? -90 : 90);
    // const imgData = cropper.getImageData();
    const canvasData = cropper.getCanvasData();
    // console.log('旋转后', imgData, canvasData);
    // 画布大小位置
    cropper.setCanvasData({
      left: 0,
      top: 0,
    });
    // 裁剪框大小位置
    cropper.setCropBoxData({
      width: canvasData.naturalWidth,
      height: canvasData.naturalHeight,
    });
    // console.log('调整后', cropper.getImageData(), cropper.getCanvasData());
  };

  return (
    <div className={styles.hooks_cropper_modal}>
      <div className={styles.cropper_container_container}>
        <div className={styles.cropper_container}>
          <Cropper
            src={src}
            className={styles.cropper}
            // Cropper.js options
            viewMode={2}
            rotatable={true}
            zoomable={true}
            autoCropArea={1}
            aspectRatio={imgRatio || NaN} // 固定为1:1  可以自己设置比例, 默认情况为自由比例
            preview=".cropper_preview"
            onInitialized={(instance) => {
              setCropper(instance);
            }}
          />
        </div>
        <div className={styles.preview_container}>
          <div className={styles.cropper_preview_set_box}>
            <div className={`cropper_preview ${styles.cropper_preview}`} />
            <div>
              <div className={styles.rotate_btn_box}>
                <RotateLeftOutlined
                  onClick={() => rotateImg('left')}
                  className={styles.rotate_i_btn}
                />
              </div>
              <div className={styles.rotate_btn_box}>
                <RotateRightOutlined
                  onClick={() => rotateImg('right')}
                  className={styles.rotate_i_btn}
                />
              </div>
            </div>
          </div>
          <div className={styles.button_row}>
            <button type="button" className={styles.submit_button} onClick={handleSubmit}>
              确认
            </button>
            {!hiddenClose && (
              <button type="button" className={styles.submit_button_end} onClick={onClose}>
                取消
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImgCutModal;
