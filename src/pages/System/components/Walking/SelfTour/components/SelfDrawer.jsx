import React, { useState } from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import FormCondition from '@/components/FormCondition';
import ShareCoupon from './ShareCoupon';

const SelfDrawer = (props) => {
  const { dispatch, childRef, visible, onClose, loading } = props;

  const { show = false, type = 'add', detail = {} } = visible;
  const { configSelfTourGoodsId } = detail;
  const [form] = Form.useForm();

  const fetchGetFormData = () => {
    form.validateFields().then((values) => {
      console.log(values);
      const { specialGoods } = values;
      dispatch({
        type: 'walkingManage/fetchGetSelfTourGoodsEdit',
        payload: {
          configSelfTourGoodsId,
          activityGoodsObjectList: specialGoods.map((item) => ({
            activityGoodsId: item.specialGoodsId,
            ownerId: item.ownerIdString,
          })),
          flag: 'updateConfig',
        },
        callback: () => {
          onClose();
          childRef.current.fetchGetData();
        },
      });
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
