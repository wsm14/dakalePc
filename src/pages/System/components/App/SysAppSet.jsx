import React, { useState } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Drawer, Button, Space, Form } from 'antd';
import { BANNER_TYPE, BANNER_JUMP_TYPE } from '@/common/constant';
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
        coverImg: { fileList: afile },
        beginDate: time,
        jumpType,
      } = values;

      // 上传图片到oss -> 提交表单
      aliOssUpload(afile[0].originFileObj).then((res) => {
        dispatch({
          type: 'sysAppList/fetchBannerSet',
          payload: {
            ...values,
            jumpType: jumpType === '无' ? '' : jumpType,
            coverImg: res[0],
            beginDate: time[0].format('YYYY-MM-DD 00:00:00'),
            endDate: time[1].format('YYYY-MM-DD 00:00:00'),
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
      name: 'coverImg',
    },
    {
      label: '图片位置',
      type: 'select',
      name: 'bannerType',
      select: BANNER_TYPE,
    },
    {
      type: 'textArea',
      label: '图片说明',
      name: 'description',
    },
    {
      type: 'rangePicker',
      label: '展示时间',
      name: 'beginDate',
      disabledDate: (time) => time && time < moment().endOf('day').subtract(1, 'day'),
    },
    {
      label: '跳转类型',
      type: 'select',
      name: 'jumpType',
      select: BANNER_JUMP_TYPE,
      onChange: (value) => {
        setShowUrl(value !== '无');
        form.setFieldsValue({ descsdription: '' });
      },
    },
    {
      label: '跳转链接',
      visible: showUrl,
      name: 'jumpUrl',
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
