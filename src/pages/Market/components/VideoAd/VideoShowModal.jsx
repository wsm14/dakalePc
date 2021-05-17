import React, { useRef } from 'react';
import { Modal } from 'antd';

const VideoShowModal = (props) => {
  const { visible = {}, onClose } = props;

  const videoRef = useRef(null);

  const { show = false, detail = { videoContentOb: {} } } = visible;

  const videoData = detail.videoContentOb || {};

  // 关闭 暂停播放
  const handleVideoClose = () => {
    videoRef.current.pause();
    onClose();
  };

  return (
    <Modal
      title={`视频 - ${detail.title}`}
      width={(Number(videoData.width) || 800) / 2 + 48}
      destroyOnClose
      footer={null}
      visible={show}
      onCancel={handleVideoClose}
    >
      <video
        src={videoData.url}
        ref={videoRef}
        controls="controls"
        style={{
          maxHeight: Number(videoData.height) / 2,
          margin: '0 auto',
          width: (Number(videoData.width) || 800) / 2,
        }}
        autoPlay
      >
        <track kind="captions" />
      </video>
    </Modal>
  );
};

export default VideoShowModal;
