import React from 'react';
import { connect } from 'umi';
import { Drawer, Button, Space, Form } from 'antd';
import FormCondition from '@/components/FormCondition';
import DescriptionsCondition from '@/components/DescriptionsCondition';

const FeedBackDetail = ({ loading, visible, dispatch, onClose, cRef }) => {
  const { show = false, info } = visible;
  const [form] = Form.useForm();

  const description = [
    {
      label: '反馈人',
      name: 'wakeUpSignBeanAmount',
    },
    {
      label: '反馈时间',
      name: 'wakeUpSigmount',
    },
    {
      label: '内容描述',
      name: 'wakeeanAmount',
    },
  ];

  const formItems = [
    {
      type: 'textArea',
      label: '回复内容',
      name: 'description',
      maxLength: 100,
    },
  ];

  const handleFinish = () => {
    form.validateFields().then((values) => {
      dispatch({
        type: 'serviceFeedBack/fetchFeedBackPush',
        payload: {
          ...values,
        },
        callback: () => {
          onClose();
          cRef.current.fetchGetData();
        },
      });
    });
  };

  return (
    <Drawer
      visible={show}
      title="问题详情"
      width={560}
      maskClosable
      destroyOnClose
      onClose={onClose}
      bodyStyle={{ paddingBottom: 80 }}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Space>
            <Button onClick={onClose}>关闭</Button>
            <Button onClick={handleFinish} type="primary" loading={loading}>
              确认回复
            </Button>
          </Space>
        </div>
      }
    >
      <DescriptionsCondition formItems={description} initialValues={info}></DescriptionsCondition>
      <div style={{ marginTop: 50 }}>
        <DescriptionsCondition
          formItems={[
            {
              label: '客服回复',
              name: 'wakeUpSignBeanAmount',
              render: (val) => (val ? val : '暂无'),
            },
          ]}
          initialValues={info}
        ></DescriptionsCondition>
      </div>
      <div style={{ position: 'fixed', width: 512, bottom: 60 }}>
        <FormCondition formItems={formItems} form={form} />
      </div>
    </Drawer>
  );
};
export default connect(({ customerFeedBack, loading }) => ({
  customerFeedBack,
  loading: loading.effects['serviceFeedBack/fetchFeedBackPush'],
}))(FeedBackDetail);
