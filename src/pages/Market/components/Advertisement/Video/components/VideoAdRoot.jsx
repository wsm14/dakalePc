import React from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';

const VideoAdRoot = (props) => {
  const { visible, dispatch, onClose, loading, rootCount = {} } = props;

  const [form] = Form.useForm();

  // 提交
  const fetchGetFormData = () => {
    form.validateFields().then((values) => {
      dispatch({
        type: 'videoAdvert/fetchVideoAdvertRootCountSet',
        payload: values,
        callback: onClose,
      });
    });
  };

  const formItems = [
    {
      label: '每隔',
      name: 'count',
      suffix: '个视频显示一次广告视频',
      placeholder: '请输入视频数量',
    },
  ];

  const modalProps = {
    title: '编辑',
    visible: visible,
    onClose,
    footer: (
      <Button onClick={fetchGetFormData} type="primary" loading={loading}>
        确认
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      <FormCondition initialValues={rootCount} formItems={formItems} form={form} />
    </DrawerCondition>
  );
};

export default connect(({ videoAdvert, loading }) => ({
  rootCount: videoAdvert.rootCount,
  loading: loading.effects['videoAdvert/fetchVideoAdvertRootCountSet'],
}))(VideoAdRoot);
