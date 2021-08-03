import React, { useRef } from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';

const ShareLikeDateSet = (props) => {
  const { dispatch, visible = {}, onClose, loading } = props;

  const { detail = {} } = visible;
  const { videoContent = {} } = detail;
  const [form] = Form.useForm();
  const videoRef = useRef(null);

  // 提交
  const fetchFormData = () => {
    form.validateFields().then((values) => {
      dispatch({
        type: 'shareManage/fetchShareLikeSet',
        payload: {
          momentId: detail.userMomentIdString,
          ...values,
        },
        callback: onClose,
      });
    });
  };

  const formItems = [
    {
      label: '收藏数',
      name: 'collectionAmount',
      type: 'number',
      min: 0,
    },
    {
      label: '分享数',
      name: 'shareAmount',
      type: 'number',
      min: 0,
    },
  ];

  const modalProps = {
    title: `设置 - ${detail.merchantName} - ${detail.title}`,
    width: 560,
    visible,
    onClose: () => {
      videoRef.current.pause();
      onClose();
    },
    footer: (
      <Button onClick={fetchFormData} type="primary" loading={loading}>
        确认
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      <video
        ref={videoRef}
        controls="controls"
        style={{ maxHeight: 300, margin: '0 auto', width: '100%' }}
        src={videoContent.url}
      >
        <track kind="captions" />
      </video>
      <FormCondition formItems={formItems} initialValues={detail} form={form} />
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['shareManage/fetchShareLikeSet'],
}))(ShareLikeDateSet);
