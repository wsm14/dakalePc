import React from 'react';
import { connect } from 'umi';
import { Form, Button } from 'antd';
import FormCondition from '@/components/FormCondition';
import aliOssUpload from '@/utils/aliOssUpload';

const SettlementEdit = (props) => {
  const { form, initialValues, dispatch, loading } = props;

  const formItems = [
    {
      label: '分享海报图',
      name: 'shareImg',
      type: 'upload',
      maxFile: 1,
      rules: [{ required: false }],
    },
    {
      label: '微信好友分享图',
      name: 'friendShareImg',
      type: 'upload',
      maxFile: 1,
      maxSize: 128,
      isCut: false,
      rules: [{ required: false }],
      extra: '请上传比例为 5 * 4，大小128kb以内的jpg图片（375 * 300以上）',
    },
    {
      label: '自定义标题',
      name: 'customTitle',
      type: 'textArea',
      maxLength: 50,
      rows: 3,
      rules: [{ required: false }],
    },
  ];
  const handleSave = () => {
    form.validateFields().then(async (values) => {
      const { shareImg = '', friendShareImg = '', customTitle } = values;
      const sImg = await aliOssUpload(shareImg);
      const fImg = await aliOssUpload(friendShareImg);
      dispatch({
        type: 'couponManage/fetchCouponManageShareEdit',
        payload: {
          ownerCouponIdString,
          ownerIdString,
          shareImg: sImg.toString(),
          friendShareImg: fImg.toString(),
          customTitle,
        },
        callback: onClose,
      });
    });
  };

  return (
    <FormCondition form={form} formItems={formItems} initialValues={initialValues}></FormCondition>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['couponManage/fetchCouponManageShareEdit'],
}))(SettlementEdit);
