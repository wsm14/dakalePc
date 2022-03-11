import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import ResourceContentForm from './ResourceContentForm';

const CouponDrawer = (props) => {
  const { visible, dispatch, childRef, onClose, loading, loadingDetail, resourceTemplateList } =
    props;

  const { type = 'add', show = false, detail = {} } = visible;

  const [form] = Form.useForm();

  useEffect(() => {
    dispatch({
      type: 'walkingManage/fetchListResourceTemplate',
      payload: {
        deleteFlag: 1,
      },
    });
  }, []);

  // 确认提交
  const handleUpAudit = () => {
    form.validateFields().then(async (values) => {
      console.log('提交', values);
    });
  };

  const listProps = {
    resourceTemplateList,
  };

  // 统一处理弹窗
  const drawerProps = {
    add: {
      title: '新增',
      children: (
        <ResourceContentForm
          {...listProps}
          form={form}
          initialValues={detail}
        ></ResourceContentForm>
      ),
    },
    edit: {
      title: '编辑',
      children: <ResourceContentForm form={form} initialValues={detail}></ResourceContentForm>,
    },
  }[type];

  // 弹窗属性
  const modalProps = {
    title: drawerProps.title,
    visible: show,
    onClose,
    loading: loadingDetail,
    footer: ['add', 'edit'].includes(type) && (
      <Button onClick={handleUpAudit} type="primary" loading={loading}>
        保存
      </Button>
    ),
  };

  return <DrawerCondition {...modalProps}>{drawerProps.children}</DrawerCondition>;
};

export default connect(({ loading, walkingManage }) => ({
  resourceTemplateList: walkingManage.resourceTemplateList.list,
  loading:
    loading.effects['spreeManage/fetchCreatePlatformGiftPack'] ||
    loading.effects['spreeManage/fetchUpdatePlatformGiftPack'],
  loadingDetail: loading.effects['walkingManage/fetchListResourceTemplate'],
}))(CouponDrawer);
