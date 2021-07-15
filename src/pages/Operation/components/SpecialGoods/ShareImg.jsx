import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { Form } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import FormCondition from '@/components/FormCondition';

const ShareImg = (props) => {
  const { visible, onClose, dispatch } = props;
  const { show = false, goodsName, ownerName } = visible;

  const [form] = Form.useForm();
  const formItems = [
    {
      label: '分享图',
      name: 'shareImg',
      type: 'upload',
      maxFile: 1,
    },
  ];

  const modalProps = {
    visible: show,
    title: `${ownerName}--${goodsName}`,
    onClose,
  };
  return (
    <DrawerCondition {...modalProps}>
      <FormCondition form={form} formItems={formItems}></FormCondition>
    </DrawerCondition>
  );
};

export default ShareImg;
