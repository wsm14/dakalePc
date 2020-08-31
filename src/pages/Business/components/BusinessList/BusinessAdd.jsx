import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Drawer, Button, Space, Form, Steps } from 'antd';
import BusinessAddBeas from './BusinessAddBeas';
import BusinessAddQuality from './BusinessAddQuality';
import aliOssUpload from '@/utils/aliOssUpload';

const steps = [
  {
    title: '基础信息',
    content: 'First-content',
  },
  {
    title: '资质信息',
    content: 'Second-content',
  },
];

const BusinessAdd = (props) => {
  const { dispatch, cRef, visible, onClose, loading } = props;

  const [form] = Form.useForm();
  const [current, setCurrent] = useState(0);
  const [beasInfo, setBeasInfo] = useState({});
  const [qualityInfo, setQualityInfo] = useState({});

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
            ...beasInfo,
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

  // 下一步
  const handleInfoNext = () => {
    form.validateFields().then((values) => {
      setBeasInfo(values);
      setCurrent(1);
    });
  };

  // 上一步
  const handleInfoOut = () => {
    setQualityInfo(form.getFieldsValue());
    setCurrent(0);
  };

  useEffect(() => {
    const boxCollection = document.getElementsByClassName('ant-drawer-body');
    if (boxCollection[0]) boxCollection[0].scrollTo(0, 0);
  }, []);

  const modalProps = {
    title: `新增商户`,
    width: 560,
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
            {current === 0 && <Button onClick={onClose}>取消</Button>}
            {current === 0 && (
              <Button onClick={handleInfoNext} type="primary" loading={loading}>
                下一步
              </Button>
            )}
            {current === 1 && (
              <>
                <Button onClick={handleInfoOut} loading={loading}>
                  上一步
                </Button>
                <Button onClick={fetchFormData} type="primary" loading={loading}>
                  提交审核
                </Button>
              </>
            )}
          </Space>
        </div>
      }
    >
      <Steps current={current}>
        {steps.map((item) => (
          <Steps.Step key={item.title} title={item.title} />
        ))}
      </Steps>
      {current === 0 && <BusinessAddBeas initialValues={beasInfo} form={form} />}
      {current === 1 && <BusinessAddQuality initialValues={qualityInfo} form={form} />}
    </Drawer>
  );
};

export default connect(({ businessList, loading }) => ({
  brandList: businessList.brandList.list,
  loading: loading.models.businessList,
}))(BusinessAdd);
