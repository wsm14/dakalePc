import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Drawer, Button, Space, Form } from 'antd';
import BusinessAddBeas from './BusinessAddBeas';
import BusinessAddQuality from './BusinessAddQuality';
import aliOssUpload from '@/utils/aliOssUpload';

const BusinessAdd = (props) => {
  const { dispatch, cRef, visible, onClose, loading } = props;

  const [form] = Form.useForm();

  // 提交
  const fetchFormData = () => {
    form.validateFields().then((values) => {
      const {
        activityBeginTime: time,
        activityBanner: { fileList },
      } = values;
      const payload = {
        ...values,
        activityBeginTime: time[0].format('YYYY-MM-DD 00:00:00'),
        activityEndTime: time[1].format('YYYY-MM-DD 00:00:00'),
      };
      aliOssUpload(fileList.map((item) => item.originFileObj)).then((res) => {
        dispatch({
          type: 'businessList/fetchMerchantAdd',
          payload: {
            ...payload,
            activityBanner: res.toString(),
          },
          callback: () => {
            onClose();
            cRef.current.fetchGetData();
          },
        });
      });
    });
  };

  const modalProps = {
    title: `新增商户`,
    width: 600,
    visible,
    maskClosable: false,
    destroyOnClose: true,
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
            <Button onClick={fetchFormData} type="primary" loading={loading}>
              提交审核
            </Button>
          </Space>
        </div>
      }
    >
      <BusinessAddBeas form={form} />
      <BusinessAddQuality form={form} />
    </Drawer>
  );
};

export default connect(({ loading }) => ({
  loading: loading.models.businessList,
}))(BusinessAdd);
