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
  const handleUpAudit = () => {
    form.validateFields().then((value) => {
      const { orderId } = detail;
      dispatch({
        type: 'ordersList/fetchOrderDeliverGoods',
        payload: {
          orderId,
          isDelivery: 1,
          ...value,
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
    loding: loading,
  };

  return <DrawerCondition {...modalProps}>{drawerProps.children}</DrawerCondition>;
};

export default connect(({ loading }) => ({
  loading: loading.effects['ordersList/fetchOrderDetail'],
}))(OrderDrawer);
