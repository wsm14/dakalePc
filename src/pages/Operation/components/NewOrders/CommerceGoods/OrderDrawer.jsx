import React, { useEffect } from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import BoxPushSet from './OrderPushSet';
import BoxDetail from './OrderDetail';

const OrderDrawer = (props) => {
  const { dispatch, visible, childRef, onClose, loading } = props;

  const { show = false, detail = {} } = visible;
  const [form] = Form.useForm();

  useEffect(() => {
    show && dispatch({ type: 'baseData/fetchListExpressCompany' });
  }, [show]);

  //提交发货
  const handleUpAudit = () => {
    form.validateFields().then((value) => {
      const { orderId, userId } = detail;
      dispatch({
        type: 'ordersList/fetchDeliverGoods',
        payload: {
          orderId,
          userId,
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

  // 弹出窗属性
  const modalProps = {
    title: '发货',
    visible: show,
    onClose,
    loding: loading,
    footer: (
      <Button onClick={handleUpAudit} type="primary" loading={loading}>
        发货
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      <BoxPushSet form={form} initialValues={detail}></BoxPushSet>
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['ordersList/fetchOrderDetail'],
}))(OrderDrawer);
