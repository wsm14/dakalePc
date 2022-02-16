import React from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import BoxPushSet from './BoxPushSet';
import BoxDetail from './BoxDetail';

const BoxDrawer = (props) => {
  const { dispatch, visible, childRef, onClose, loading, userType } = props;

  const { type = 'info', shwo = false, detail = {} } = visible;
  const [form] = Form.useForm();

  //提交发货
  const handleUpAudit = (now) => {
    form.validateFields().then((value) => {
      dispatch({
        type: 'boxLottery/fetchBoxAddAndPush',
        payload: {
          ...value,
          blindBoxRewardId: detail.blindBoxRewardId,
        },
        callback: () => {
          onClose();
          childRef.current.fetchGetData();
        },
      });
    });
  };

  // 新增修改公共处理
  const addEditProps = {
    children: <BoxPushSet form={form} initialValues={detail}></BoxPushSet>,
    footer: (
      <>
        <Button onClick={handleUpAudit} type="primary" loading={loading}>
          发货
        </Button>
      </>
    ),
  };

  // 统一处理
  const drawerProps = {
    add: {
      title: '发货',
      ...addEditProps,
    },
    info: {
      title: '查看物流',
      children: <BoxDetail initialValues={detail}></BoxDetail>,
    },
  }[type];

  // 弹出窗属性
  const modalProps = {
    title: `${drawerProps.title}`,
    visible: shwo,
    onClose,
    footer: drawerProps.footer,
  };

  return <DrawerCondition {...modalProps}>{drawerProps.children}</DrawerCondition>;
};

export default connect(({ loading }) => ({
  loading: loading.effects['boxlottery/fetchBoxAddAndPush'],
}))(BoxDrawer);
