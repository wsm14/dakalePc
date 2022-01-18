import React, { useState } from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import CouponRulesManageDetail from './Detail/CouponRulesManageDetail';
import CouponRulesManageSet from './Form/CouponRulesManageSet';

const CouponDrawer = (props) => {
  const { visible, dispatch, childRef, onClose, loading, loadingDetail } = props;

  const { type = 'info', platformCouponId, show = false, detail = {} } = visible;

  const [form] = Form.useForm();

  // 确认提交
  const handleUpAudit = () => {
    form.validateFields().then(async (values) => {
      console.log('values', values);
    });
  };

  const listProp = {
    type,
  };
  // 统一处理弹窗
  const drawerProps = {
    info: {
      title: '查看规则',
      children: <CouponRulesManageDetail detail={detail}></CouponRulesManageDetail>,
    },
    add: {
      title: '新建规则',
      children: (
        <CouponRulesManageSet
          {...listProp}
          form={form}
          initialValues={detail}
        ></CouponRulesManageSet>
      ),
    },
    edit: {
      title: '编辑规则',
      children: (
        <CouponRulesManageSet
          {...listProp}
          form={form}
          initialValues={detail}
        ></CouponRulesManageSet>
      ),
    },
  }[type];

  // 弹窗属性
  const modalProps = {
    title: drawerProps.title,
    visible: show,
    onClose,
    loading: loadingDetail,
    closeCallBack: () => {},
    footer: (
      <Button onClick={handleUpAudit} type="primary" loading={loading}>
        确定
      </Button>
    ),
  };

  return <DrawerCondition {...modalProps}>{drawerProps.children}</DrawerCondition>;
};

export default connect(({ loading }) => ({
  loading:
    loading.effects['platformCoupon/fetchPlatformCouponSave'] ||
    loading.effects['platformCoupon/fetchPlatformCouponUpdate'],
  loadingDetail: loading.effects['platformCoupon/fetchGetPlatformCouponDetail'],
}))(CouponDrawer);
