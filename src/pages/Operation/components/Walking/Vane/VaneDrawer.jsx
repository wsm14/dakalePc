import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import aliOssUpload from '@/utils/aliOssUpload';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';

const VaneDrawer = (props) => {
  const { dispatch, cRef, visible, onClose, loading } = props;

  const { show = false, type = 'add', info = '' } = visible;
  const [form] = Form.useForm();
  const [showUrl, setShowUrl] = useState(false);

  useEffect(() => {
    if (show) setShowUrl(info.jumpType || false);
  }, [show]);

  // 提交
  const fetchGetFormData = () => {
    form.validateFields().then((values) => {
      const { coverImg, jumpType } = values;

      // 上传图片到oss -> 提交表单
      aliOssUpload(coverImg).then((res) => {
        dispatch({
          type: { true: 'sysAppList/fetchBannerSet', false: 'sysAppList/fetchBannerEdit' }[!info],
          payload: {
            bannerId: info.bannerIdString,
            ...values,
            jumpType: jumpType === '无' ? '' : jumpType,
            coverImg: res.toString(),
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
      label: '显示名称',
      name: 'bannerType',
      maxLength: 6,
    },
    {
      label: '显示图标',
      type: 'upload',
      name: 'coverImg',
      maxFile: 1,
      extra: '请上传XX*XX尺寸png、jpeg格式图片',
    },
    {
      label: '跳转类型',
      type: 'radio',
      name: 'jumpType',
      select: ['跳转至URL', '按场景显示'],
      onChange: (value) => setShowUrl(value !== '无'),
    },
    {
      label: '选择场景',
      type: 'treeSelect',
      name: 'jumpUrl',
    },
  ];

  const modalProps = {
    title: info ? '编辑' : '新增',
    visible: show,
    onClose,
    footer: (
      <Button onClick={fetchGetFormData} type="primary" loading={loading}>
        确认
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      <FormCondition initialValues={{}} formItems={formItems} form={form} />
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loading: loading.models.sysAppList,
}))(VaneDrawer);
