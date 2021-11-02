import React from 'react';
import { connect } from 'umi';
import DrawerCondition from '@/components/DrawerCondition';
import { Form, Button } from 'antd';
import FormCondition from '@/components/FormCondition';

function VideoSet(props) {
  const { visible, onClose, dispatch, childRef } = props;
  const { show, detail = {} } = visible;
  const videoUrl = JSON.parse(detail.videoContent || '{}')['url'];

  console.log(detail, 'detail');

  const [form] = Form.useForm();

  const formItems = [
    {
      label: '初始收藏数',
      type: 'number',
      name: 'collectionAmount',
      rules: [{ required: false }],
    },
    {
      label: '初始分享数',
      type: 'number',
      name: 'shareAmount',
      rules: [{ required: false }],
    },
  ];
  // 提交表单
  const handleUpdataSava = () => {
    console.log(1);
    form.validateFields().then((values) => {
      console.log(values, 'values');
      dispatch({
        type: 'videoAdvert/fetchVideoAdvertShareSet',
        payload: {
          platformMomentId: detail?.platformMomentId,
          collectionAmount: values.collectionAmount,
          shareAmount: values.shareAmount,
        },
        callback: () => {
          onClose();
          childRef.current.fetchGetData();
        },
      });
    });
  };
  const modalProps = {
    title: `设置 - ${detail.relateName} - ${detail.title}`,
    visible: show,
    onClose,
    footer: (
      <>
        {
          <Button
            type="primary"
            onClick={handleUpdataSava}
            // loading={loading}
          >
            保存
          </Button>
        }
      </>
    ),
  };
  return (
    <>
      <DrawerCondition {...modalProps}>
        <video src={videoUrl} style={{ width: '100%', height: '300px' }} controls></video>
        <FormCondition form={form} formItems={formItems} initialValues={detail}></FormCondition>
      </DrawerCondition>
    </>
  );
}

export default connect(({ loading }) => ({
  loading: loading.effects['videoAdvert/fetchVideoAdvertShareSet'],
}))(VideoSet);
