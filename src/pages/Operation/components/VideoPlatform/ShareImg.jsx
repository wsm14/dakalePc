import React from 'react';
import { connect } from 'umi';
import { WXFRIEND_SHARE_IMG } from '@/common/imgRatio';
import { Form, Button } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import FormCondition from '@/components/FormCondition';
import aliOssUpload from '@/utils/aliOssUpload';

const ShareImg = (props) => {
  const { visible, onClose, onSubmit, loading } = props;
  const { show = false, detail = {} } = visible;

  const { momentId, ownerId, ownerName, title } = detail;

  const [form] = Form.useForm();

  const formItems = [
    {
      label: '好友分享图',
      name: 'friendShareImg',
      type: 'upload',
      maxFile: 1,
      imgRatio: WXFRIEND_SHARE_IMG,
      rules: [{ required: false }],
      extra: '请上传比例为 5 * 4，大小128kb以内的jpg图片（375 * 300以上）',
    },
  ];

  const handleSave = () => {
    form.validateFields().then(async (values) => {
      const { friendShareImg = '' } = values;
      const fImg = await aliOssUpload(friendShareImg);
      onSubmit(
        {
          momentId,
          ownerId,
          friendShareImg: fImg.toString(),
        },
        onClose,
      );
    });
  };

  const modalProps = {
    visible: show,
    title: `${ownerName}--${title}`,
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
        initialValues={detail}
      ></FormCondition>
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['specialGoods/fetchSpecialGoodsShareEdit'],
}))(ShareImg);
