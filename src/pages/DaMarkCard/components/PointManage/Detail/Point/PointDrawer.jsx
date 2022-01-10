import React, { useState } from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import PointSet from './PointSet';

// 哒小卡点位   新增/编辑

const PointDrawer = (props) => {
  const { visible, dispatch, childRef, onClose, loading, loadingDetail } = props;

  const { type = 'add', hittingId, show = false, detail = {} } = visible;

  const [form] = Form.useForm();

  // 确认提交
  const handleUpAudit = () => {
    form.validateFields().then(async (values) => {
      const { districtCode, ...other } = values;

      dispatch({
        type: {
          add: 'pointManage/fetchSaveHitting',
          edit: 'pointManage/fetchUpdateHitting',
        }[type],
        payload: {
          mainId: detail.mainId,
          hittingId,
          ...other,
          provinceCode: districtCode.slice(0, 2),
          cityCode: districtCode.slice(0, 4),
          districtCode,
        },
        callback: () => {
          onClose();
          childRef.current.fetchGetData();
        },
      });
    });
  };

  const listProp = {};
  // 统一处理弹窗
  const drawerProps = {
    add: {
      title: '新增点位',
      children: <PointSet {...listProp} form={form} initialValues={detail}></PointSet>,
    },
    edit: {
      title: '编辑点位',
      children: <PointSet {...listProp} form={form} initialValues={detail}></PointSet>,
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

export default connect(({ loading }) => ({
  loading:
    loading.effects['pointManage/fetchSaveHitting'] ||
    loading.effects['pointManage/fetchUpdateHitting'],
  loadingDetail: loading.effects['pointManage/fetchGetHittingById'],
}))(PointDrawer);
