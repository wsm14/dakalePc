import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { Form, Button } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import FormCondition from '@/components/FormCondition';
import aliOssUpload from '@/utils/aliOssUpload';

const ShareImg = (props) => {
  const { visible, onClose, dispatch } = props;
  const {
    show = false,
    goodsName,
    ownerName,
    specialGoodsId = '',
    ownerIdString = '',
    ShareImg = '',
  } = visible;

  const [form] = Form.useForm();
  const formItems = [
    {
      label: '分享图',
      name: 'shareImg',
      type: 'upload',
      maxFile: 1,
    },
  ];
  const handleSave = () => {
    form.validateFields().then((values) => {
      const { shareImg } = values;
      aliOssUpload(shareImg).then((res) => {
        dispatch({
          type: 'specialGoods/fetchSpecialGoodsEdit',
          payload: {
            id: specialGoodsId,
            ownerId: ownerIdString,
            ShareImg: res.toString(),
          },
        });
      });
    });
  };

  const modalProps = {
    visible: show,
    title: `${ownerName}--${goodsName}`,
    onClose,
    footer: (
      <Button type="primary" onClick={handleSave}>
        确认
      </Button>
    ),
  };
  return (
    <DrawerCondition {...modalProps}>
      <FormCondition form={form} formItems={formItems}></FormCondition>
    </DrawerCondition>
  );
};

export default connect(() => ({}))(ShareImg);
