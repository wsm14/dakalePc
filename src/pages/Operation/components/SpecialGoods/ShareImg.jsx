import React from 'react';
import { connect } from 'umi';
import { WXFRIEND_SHARE_IMG } from '@/common/imgRatio';
import { Form, Button } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import FormCondition from '@/components/FormCondition';
import aliOssUpload from '@/utils/aliOssUpload';

const ShareImg = (props) => {
  const { visible, onClose, dispatch, loading } = props;
  const {
    show = false,
    goodsName,
    ownerName,
    specialGoodsId = '',
    ownerIdString = '',
    initialValues = {},
  } = visible;

  const [form] = Form.useForm();
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
      maxSize: 128,
      maxFile: 1,
      compress: true,
      imgRatio: WXFRIEND_SHARE_IMG,
      rules: [{ required: false }],
      extra: '请上传比例为 5 * 4，大小128kb以内的jpg图片（375 * 300以上）',
    },
    {
      label: '推荐理由',
      name: 'recommendReason',
      type: 'textArea',
      maxLength: 100,
      rows: 3,
      rules: [{ required: false }],
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
      const { shareImg = '', friendShareImg = '', recommendReason, customTitle } = values;
      const sImg = await aliOssUpload(shareImg);
      const fImg = await aliOssUpload(friendShareImg);
      dispatch({
        type: 'specialGoods/fetchSpecialGoodsShareEdit',
        payload: {
          id: specialGoodsId,
          ownerId: ownerIdString,
          shareImg: sImg.toString(),
          friendShareImg: fImg.toString(),
          recommendReason,
          customTitle,
        },
        callback: onClose,
      });
    });
  };

  const modalProps = {
    visible: show,
    title: `${ownerName}--${goodsName}`,
    onClose,
    footer: (
      <Button type="primary" onClick={handleSave} loading={loading}>
        确认
      </Button>
    ),
  };
  return (
    <DrawerCondition {...modalProps}>
      <FormCondition
        form={form}
        formItems={formItems}
        initialValues={initialValues}
      ></FormCondition>
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['specialGoods/fetchSpecialGoodsShareEdit'],
}))(ShareImg);
