import React from 'react';
import { Modal } from 'antd';

const VideoShowModal = (props) => {
  const { visible = {}, onClose } = props;

  const { show = false, detail = { imageContent: '[]' } } = visible;

  return (
    <Modal
      title={`视频 - ${detail.title}`}
      width={548}
      destroyOnClose
      footer={null}
      visible={show}
      onCancel={onClose}
    >
      <video
        src={JSON.parse(detail.videoContent || '{}').url}
        controls="controls"
        style={{ maxHeight: 300, margin: '0 auto', width: 500 }}
        autoPlay
      >
        <track kind="captions" />
      </video>
    </Modal>
  );
};

export default VideoShowModal;
