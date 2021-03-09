import React, { useState } from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import aliOssUpload from '@/utils/aliOssUpload';
import FormCondition from '@/components/FormCondition';
import DescriptionsCondition from '@/components/DescriptionsCondition';
import DrawerCondition from '@/components/DrawerCondition';

const VaneDrawer = (props) => {
  const { dispatch, cRef, visible, onClose, loading } = props;

  const { show = false, type = 'add', detail = '' } = visible;
  const [form] = Form.useForm();
  const [showPop, setShowPop] = useState(false); // 显示气泡
  const [showUrl, setShowUrl] = useState(false); // 显示选择框或者URL

  const allProps = {
    add: {
      title: '新增',
      api: 'sysAppList/fetchBannerSet',
    },
    edit: {
      title: '修改',
      api: 'sysAppList/fetchBannerEdit',
    },
  }[type];

  // 提交
  const fetchGetFormData = () => {
    form.validateFields().then((values) => {
      const { coverImg, jumpType } = values;
      // 上传图片到oss -> 提交表单
      aliOssUpload(coverImg).then((res) => {
        dispatch({
          type: allProps.api,
          payload: {
            bannerId: detail.bannerIdString,
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
      label: '显示气泡',
      type: 'switch',
      name: 'jumpTysspe',
      rules: [{ required: false }],
      onChange: setShowPop,
      show: false,
    },
    {
      label: '气泡内容',
      name: 'jumpssTypes',
      visible: showPop,
      maxLength: 4,
    },
    {
      label: '跳转类型',
      type: 'radio',
      name: 'jumpType',
      select: ['跳转至URL', '按场景显示'],
      onChange: (e) => setShowUrl(e.target.value),
    },
    {
      label: '链接',
      name: 'jumsspUrl',
      visible: showUrl === '0',
    },
    {
      label: '选择场景',
      type: 'treeSelect',
      name: 'jumpUrl',
      visible: showUrl === '1',
    },
  ];

  const modalProps = {
    title: allProps.title,
    visible: show,
    onClose,
    afterCallBack: () => {
      setShowPop(detail.jumpType || false);
      setShowUrl(detail.jumpType || false);
    },
    footer: (
      <Button onClick={fetchGetFormData} type="primary" loading={loading}>
        确认
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      {type === 'detail' ? (
        <DescriptionsCondition initialValues={detail} formItems={formItems}></DescriptionsCondition>
      ) : (
        <FormCondition initialValues={detail} formItems={formItems} form={form} />
      )}
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loading: loading.models.sysAppList,
}))(VaneDrawer);
