import React from 'react';
import { connect } from 'umi';
import { VIDEO_SHARE_IMG } from '@/common/imgRatio';
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
      label: '朋友圈分享图',
      name: 'shareImg',
      type: 'upload',
      maxFile: 1,
      rules: [{ required: false }],
    },
    {
      label: '好友分享图',
      name: 'friendShareImg',
      type: 'upload',
      maxFile: 1,
      imgRatio: VIDEO_SHARE_IMG,
      rules: [{ required: false }],
    },
  ];
  const handleSave = () => {
    form.validateFields().then(async (values) => {
      const { shareImg = '', friendShareImg = '' } = values;
      const sImg = await aliOssUpload(shareImg);
      const fImg = await aliOssUpload(friendShareImg);
      dispatch({
        type: 'specialGoods/fetchSpecialGoodsShareEdit',
        payload: {
          id: specialGoodsId,
          ownerId: ownerIdString,
          shareImg: sImg.toString(),
          friendShareImg: fImg.toString(),
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
