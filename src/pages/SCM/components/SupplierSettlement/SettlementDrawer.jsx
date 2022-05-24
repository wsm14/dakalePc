import React, { useState } from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import SettlementDetail from './Detail/SettlementDetail';
import SettlementEdit from './Form/SettlementEdit';
import aliOssUpload from '@/utils/aliOssUpload';

const SupplierSettlementDrawer = (props) => {
  const {
    visible = {},
    dispatch,
    total,
    childRef,
    onClose,
    getDetail,
    loading,
    loadingDetail,
  } = props;

  const { mode = 'info', index, show = false, detail = {} } = visible;
  const [form] = Form.useForm();

  // 确认提交
  const handleUpAudit = () => {
    form.validateFields().then(async (values) => {});
  };

  // 统一处理弹窗
  const drawerProps = {
    info: {
      title: '查看详情',
      children: <SettlementDetail detail={detail}></SettlementDetail>,
    },
    add: {
      title: '新增结算',
      children: <SettlementEdit form={form}></SettlementEdit>,
    },
    edit: {
      title: '编辑结算',
      children: <SettlementEdit form={form} initialValues={detail}></SettlementEdit>,
    },
  }[mode];

  // 弹窗属性
  const modalProps = {
    title: drawerProps.title,
    visible: show,
    onClose,
    loading: loadingDetail,
    closeCallBack: () => dispatch({ type: 'baseData/clearGroupMre' }), // 关闭清空搜索的商家数据
    dataPage: mode === 'info' && {
      current: index,
      total,
      onChange: (size) => getDetail(size, 'info'),
    },
    footer: ['add', 'edit'].includes(mode) && (
      <Button onClick={handleUpAudit} type="primary" loading={loading}>
        确认
      </Button>
    ),
  };

  return <DrawerCondition {...modalProps}>{drawerProps.children}</DrawerCondition>;
};

export default connect(({ loading, supplierSettlement }) => ({
  total: supplierSettlement.list.length,
  loading: loading.effects['couponManage/fetchCouponSave'],
  loadingDetail: loading.effects['couponManage/fetchCouponDetail'],
}))(SupplierSettlementDrawer);
