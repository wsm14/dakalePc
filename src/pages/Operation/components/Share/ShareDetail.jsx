import React from 'react';
import { Modal, Carousel } from 'antd';

const ShareDetail = (props) => {
  const { visible, onClose } = props;

  const { type = 'img', show = false, detail = { imageContent: '[]' } } = visible;

  const styleDiv = { height: 292, width: 500 };

  return (
    <Modal
      title={`详情 - ${detail.title}`}
      width={548}
      destroyOnClose
      footer={null}
      visible={show}
      onCancel={onClose}
    >
      {show && type == 'video' ? (
        <>
          <video
            src={JSON.parse(detail.videoContent).url}
            controls="controls"
            style={{ maxHeight: 300, margin: '0 auto', width: 500 }}
            autoPlay
          >
            <track kind="captions" />
          </video>
          <div style={{ marginTop: 15 }}>{detail.message}</div>
        </>
      ) : (
        <>
          <Carousel autoplay style={{ ...styleDiv, margin: '0 auto' }}>
            {JSON.parse(detail.imageContent).map((item) => (
              <div style={styleDiv}>
                <img src={detail.imageHost + item.key} style={styleDiv}></img>
              </div>
            ))}
          </Carousel>
          <div style={{ marginTop: 15 }}>{detail.message}</div>
        </>
      )}
    </Modal>
  );
};

export default ShareDetail;
