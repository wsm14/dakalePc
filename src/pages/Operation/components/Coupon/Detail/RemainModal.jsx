import React, { useEffect } from 'react';
import { connect } from 'umi';
import { Button, Form, Modal } from 'antd';
import FormCondition from '@/components/FormCondition';

const RemainModal = (props) => {
  const { visible = {}, onClose, dispatch, loading, childRef } = props;
  const { show = false, ownerCouponId, ownerId } = visible;
  const [form] = Form.useForm();

  const handleOk = () => {
    form.validateFields().then((values) => {
      console.log(values, 'ccc');
      dispatch({
        type: 'couponManage/fetchCouponAddRemain',
        payload: {
          ownerCouponId,
          ownerId,
          ...values,
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
      label: `投放总量`,
      name: 'remainIncrement',
    },
  ];

  const modalProps = {
    title: '设置投放总量',
    visible: show,
    onCancel: onClose,
    onOk: handleOk,
  };
  return (
    <Modal {...modalProps} loading={loading}>
      <FormCondition form={form} formItems={formItems}></FormCondition>
    </Modal>
  );
};
export default connect(({ loading }) => ({
  loading: loading.effects['couponManage/fetchCouponAddRemain'],
}))(RemainModal);
