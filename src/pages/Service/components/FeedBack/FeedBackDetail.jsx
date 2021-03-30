import React from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import FormCondition from '@/components/FormCondition';
import DescriptionsCondition from '@/components/DescriptionsCondition';
import DrawerCondition from '@/components/DrawerCondition';

const FeedBackDetail = ({ loading, visible, dispatch, onClose, cRef }) => {
  const { show = false, info } = visible;
  const [form] = Form.useForm();

  const description = [
    {
      label: '提交人',
      name: 'userName',
    },
    {
      label: '联系方式',
      name: 'telephone',
    },
    {
      label: '提交时间',
      name: 'createTime',
    },
    {
      label: '问题描述',
      name: 'problemDesc',
    },
    {
      label: '图片',
      type: 'upload',
      name: 'problemImg',
    },
  ];

  const formItems = [
    {
      type: 'textArea',
      label: '回复内容',
      name: 'replay',
      maxLength: 240,
    },
  ];

  const handleFinish = () => {
    form.validateFields().then((values) => {
      dispatch({
        type: 'serviceFeedBack/fetchFeedBackPush',
        payload: {
          feedbackIdString: info.feedbackIdString,
          ...values,
        },
        callback: () => {
          onClose();
          cRef.current.fetchGetData();
        },
      });
    });
  };

  const modalProps = {
    title: '问题详情',
    visible: show,
    onClose,
    footer: info && info.status !== '2' && (
      <Button onClick={handleFinish} type="primary" loading={loading}>
        确认回复
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      <DescriptionsCondition formItems={description} initialValues={info}></DescriptionsCondition>
      {info && info.status == '2' && (
        <div style={{ marginTop: 50 }}>
          <DescriptionsCondition
            formItems={[
              {
                label: '回复人',
                name: 'operator',
                render: (val) => (val ? val : '暂无'),
              },
              {
                label: '回复时间',
                name: 'replayTime',
                render: (val) => (val ? val : '暂无'),
              },
              {
                label: '客服回复',
                name: 'replay',
                render: (val) => (val ? val : '暂无'),
              },
            ]}
            initialValues={info}
          ></DescriptionsCondition>
        </div>
      )}
      {info && info.status !== '2' && (
        <div style={{ position: 'fixed', width: 512, bottom: 60 }}>
          <FormCondition formItems={formItems} form={form} />
        </div>
      )}
    </DrawerCondition>
  );
};
export default connect(({ loading }) => ({
  loading: loading.effects['serviceFeedBack/fetchFeedBackPush'],
}))(FeedBackDetail);
