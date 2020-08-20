import React, { useState } from 'react';
import { connect } from 'dva';
import { Drawer, Button, Space, Form } from 'antd';
import FormCondition from '@/components/FormCondition';
import aliOssUpload from '@/utils/aliOssUpload';

const SysAppSet = (props) => {
  const { dispatch, cRef, visible, onClose, loading } = props;

  const { show = false, info = '' } = visible;

  const [form] = Form.useForm();
  const [showUrl, setShowUrl] = useState(false);

  // 提交
  const fetchGetFormData = () => {
    form.validateFields().then((values) => {
      const {
        allImgs: { fileList: afile },
        activeBeginDate: time,
      } = values;

      // 上传图片到oss -> 提交表单
      aliOssUpload([afile[0].originFileObj, bfile[0].originFileObj]).then((res) => {
        dispatch({
          type: 'sysAppList/fetchBannerSet',
          payload: {
            ...values,
            allImgs: res[0],
            activeBeginDate: time[0].format('YYYY-MM-DD 00:00:00'),
            activeEndDate: time[1].format('YYYY-MM-DD 00:00:00'),
          },
          callback: () => {
            onClose();
            cRef.current.fetchGetData();
          },
        });
      });
    });
  };

  const formItems = [
    {
      label: '图片上传',
      type: 'upload',
      maxFile: 1,
      name: 'couponBanner',
    },
    {
      label: '图片位置',
      type: 'select',
      name: 'categoryCustomId',
      select: [].map((item) => ({
        value: item.categoryCustomId,
        name: item.categoryName,
      })),
    },
    {
      type: 'textArea',
      label: '图片说明',
      name: 'descriptiosn',
    },
    {
      label: '跳转类型',
      type: 'select',
      name: 'catesgoryCustsdomId',
      select: [].map((item) => ({
        value: item.categoryCustomId,
        name: item.categoryName,
      })),
      onChange: (e) => {
        setShowUrl(e.target.value === '1');
        form.setFieldsValue({ descsdription: '' });
      },
    },
    {
      label: '跳转链接',
      visible: showUrl,
      name: 'descsdription',
    },
  ];

  const modalProps = {
    title: '编辑',
    width: 560,
    visible: show,
    maskClosable: true,
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
            <Button onClick={fetchGetFormData} type="primary" loading={loading}>
              确认
            </Button>
          </Space>
        </div>
      }
    >
      <FormCondition initialValues={info} formItems={formItems} form={form} loading={loading} />
    </Drawer>
  );
};

export default connect(({ sysAppList, loading }) => ({
  sysAppList,
  loading: loading.models.sysAppList,
}))(SysAppSet);
