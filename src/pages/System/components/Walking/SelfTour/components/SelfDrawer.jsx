import React, { useState } from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import FormCondition from '@/components/FormCondition';
import ShareCoupon from './ShareCoupon';

const SelfDrawer = (props) => {
  const { dispatch, cRef, visible, onClose, loading } = props;

  const { show = false, type = 'add', detail = {} } = visible;
  const [form] = Form.useForm();

  const fetchGetFormData = () => {
    form.validateFields().then((values) => {
      console.log(values);
      // specialGoodsIds: specialGoods.map((item) => item.specialGoodsId).toString(),
    });
  };

  const formItems = [
    {
      label: '选择特惠商品',
      name: 'specialGoodsIds',
      type: 'formItem',
      // required: true,
      formItem: (
        <>
          <ShareCoupon type="specialGoods" form={form}></ShareCoupon>
        </>
      ),
    },
  ];

  const modalProps = {
    title: '编辑',
    visible: show,
    onClose,
    footer: type !== 'detail' && (
      <Button onClick={fetchGetFormData} type="primary" loading={loading}>
        确认
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      <FormCondition initialValues={detail} formItems={formItems} form={form} />
    </DrawerCondition>
  );
};

export default connect(({ walkingManage, loading, sysTradeList }) => ({
  loading: loading.models.walkingManage,
}))(SelfDrawer);
