import React from 'react';
import { Modal } from 'antd';

const ShareVideoDetail = (props) => {
  const { visible, onClose } = props;

  const { show = false, detail = { videoContent: '{}' } } = visible;
  return (
    <Modal
      title={`详情 - ${detail.title}`}
      width={548}
      destroyOnClose
      footer={null}
      visible={show}
      onCancel={onClose}
    >
      <video
        src={JSON.parse(detail.videoContent).url}
        controls="controls"
        style={{ maxHeight: 300, margin: '0 auto', width: 500 }}
        autoPlay
      >
        <track kind="captions" />
      </video>
      <div style={{ marginTop: 15 }}>{detail.message}</div>
    </Modal>
  );
};

export default ShareVideoDetail;
