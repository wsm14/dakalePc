import React, { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import Cropper from 'react-cropper'; // 引入Cropper

// eslint-disable-next-line import/no-extraneous-dependencies
import 'cropperjs/dist/cropper.css';

import styles from './index.less';

const ImgCutModal = ({ uploadedImageFile, onClose, onSubmit, imgRatio }) => {
  ImgCutModal.defaultProps = {
    imgRatio: NaN,
  };

  ImgCutModal.propTypes = {
    uploadedImageFile: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    imgRatio: PropTypes.number,
  };

  const cropperRef = useRef(null);
  const [src, setSrc] = useState(null);

  useEffect(() => {
    if (uploadedImageFile) {
      const fileReader = new FileReader();
      fileReader.onload = e => {
        const dataURL = e.target.result;
        setSrc(dataURL);
      };
      fileReader.readAsDataURL(uploadedImageFile);
    }
  }, [uploadedImageFile]);

  const handleSubmit = useCallback(() => {
    const filename = uploadedImageFile;
    // TODO: 这里可以尝试修改上传图片的尺寸
    cropperRef.current.getCroppedCanvas().toBlob(async blob => {
      // 把选中裁切好的的图片传出去
      const file = new File([blob], filename.name, { type: filename.type });
      onSubmit(file);
      // 关闭弹窗
      onClose();
    });
  }, [onClose, onSubmit]);

  return (
    <div className={styles.hooks_cropper_modal}>
      <div className={styles.cropper_container_container}>
        <div className={styles.cropper_container}>
          <Cropper
            src={src}
            className={styles.cropper}
            ref={cropperRef}
            // Cropper.js options
            checkCrossOrigin={false}
            viewMode={1}
            zoomable={false}
            aspectRatio={imgRatio || NaN} // 固定为1:1  可以自己设置比例, 默认情况为自由比例
            preview=".cropper_preview"
          />
        </div>
        <div className={styles.preview_container}>
          <div className={`cropper_preview ${styles.cropper_preview}`} />
          <div className={styles.button_row}>
            <button type="button" className={styles.submit_button} onClick={handleSubmit}>
              确认
            </button>
            <button type="button" className={styles.submit_button_end} onClick={onClose}>
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImgCutModal;
