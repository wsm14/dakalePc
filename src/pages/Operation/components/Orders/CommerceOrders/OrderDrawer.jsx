import React from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import BoxPushSet from './OrderPushSet';
import BoxDetail from './OrderDetail';

const OrderDrawer = (props) => {
  const { dispatch, visible, childRef, onClose, loading } = props;

  const { type = 'info', show = false, detail = {} } = visible;
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

  // 统一处理
  const drawerProps = {
    add: {
      title: '发货',
      children: <BoxPushSet form={form} initialValues={detail}></BoxPushSet>,
      footer: (
        <>
          <Button onClick={handleUpAudit} type="primary" loading={loading}>
            发货
          </Button>
        </>
      ),
    },
    info: {
      title: '查看物流',
      children: <BoxDetail initialValues={detail}></BoxDetail>,
    },
  }[type];

  // 弹出窗属性
  const modalProps = {
    title: `${drawerProps.title}`,
    visible: show,
    onClose,
    footer: drawerProps.footer,
  };

  return <DrawerCondition {...modalProps}>{drawerProps.children}</DrawerCondition>;
};

export default connect(({ loading }) => ({
  loading: loading.effects['boxlottery/fetchBoxAddAndPush'],
}))(OrderDrawer);
