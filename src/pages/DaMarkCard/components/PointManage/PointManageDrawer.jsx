import React, { useState } from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import PointManageSet from './Form/PlatformSet';

const PointManageDrawer = (props) => {
  const { visible, dispatch, childRef, onClose, loading, loadingDetail } = props;

  const { type = 'info', hittingMainId, show = false, detail = {} } = visible;

  const [form] = Form.useForm();

  // 确认提交
  const handleUpAudit = () => {
    form.validateFields().then(async (values) => {
      console.log('values', values);
      // return;
      const { districtCode, distanceFlag, range, ...other } = values;

      dispatch({
        type: {
          add: 'pointManage/fetchSaveHittingMain',
          edit: 'pointManage/fetchUpdateHittingMain',
        }[type],
        payload: {
          hittingMainId,
          ...other,
          provinceCode: districtCode.slice(0, 2),
          cityCode: districtCode.slice(0, 4),
          districtCode,
          distanceFlag,
          range: distanceFlag === '0' ? '999999999' : range,
        },
        callback: () => {
          onClose();
          childRef.current.fetchGetData();
        },
      });
    });
  };

  const listProp = {
    type,
  };
  // 统一处理弹窗
  const drawerProps = {
    info: {
      title: '主体详情',
      children: <PointManageSet {...listProp} form={form} initialValues={detail}></PointManageSet>,
    },
    add: {
      title: '新建主体',
      children: <PointManageSet {...listProp} form={form} initialValues={detail}></PointManageSet>,
    },
    edit: {
      title: '编辑主体',
      children: <PointManageSet {...listProp} form={form} initialValues={detail}></PointManageSet>,
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
    loading.effects['pointManage/fetchSaveHittingMain'] ||
    loading.effects['pointManage/fetchUpdateHittingMain'],
  loadingDetail: loading.effects['pointManage/fetchGetHittingMainById'],
}))(PointManageDrawer);
