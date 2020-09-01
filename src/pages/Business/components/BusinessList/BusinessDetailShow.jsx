import React from 'react';
import { connect } from 'dva';
import { Drawer, Button, Space, Form } from 'antd';
import DescriptionsCondition from '@/components/DescriptionsCondition';

const BusinessDetailShow = (props) => {
  const { dispatch, childRef, initialValues, onClose } = props;

  const [form] = Form.useForm();

  // 提交
  const fetchFormData = () => {
    form.validateFields().then((values) => {
      console.log(values);
      // dispatch({
      //   type: 'businessList/fetchMerchantSet',
      //   payload: {
      //     ...values,
      //   },
      //   callback: () => {
      //     onClose();
      //     cRef.current.fetchGetData();
      //   },
      // });
    });
  };

  const modalProps = {
    title: `设置 - ${record.merchantName}`,
    width: 560,
    visible,
    maskClosable: true,
    destroyOnClose: true,
  };

  const handleMerStatus = () => {
    Modal.confirm({
      title: `确认对该店铺 ${statusText}`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'businessList/fetchSetStatus',
          payload: { merchantId, status: Number(!statusNum) },
          callback: () => childRef.current.fetchGetData(),
        });
      },
    });
  };

  const handleMerSaleStatus = () => {
    Modal.confirm({
      title: `确认对该店铺 ${businessStatusText}`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'businessList/fetchMerSaleStatus',
          payload: { merchantId, status: Number(!businessStatusNum) },
          callback: () => childRef.current.fetchGetData(),
        });
      },
    });
  };

  return (
    <Drawer
      {...modalProps}
      onClose={onClose}
      bodyStyle={{ paddingBottom: 80 }}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Space>
            <Button onClick={onClose}>取消</Button>
            <Button type="primary" loading={loading}>
              确认
            </Button>
          </Space>
        </div>
      }
    >
      {/* <DescriptionsCondition
        formItems={formItems}
        initialValues={initialValues}
        form={form}
        loading={loading}
      /> */}
    </Drawer>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['businessList/fetchMerchantSet'],
}))(BusinessDetailShow);
