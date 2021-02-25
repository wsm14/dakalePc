import React from 'react';
import { connect } from 'umi';
import { Modal, Button, Form } from 'antd';
import FormCondition from '@/components/FormCondition';

const CloseRefuse = (props) => {
  const { dispatch, childRef, visible, onClose } = props;
  const { show = false, initialValues = {} } = visible;
  const [form] = Form.useForm();

  // 下架
  const fetchStatusClose = () => {
    form.validateFields().then((payload) => {
      dispatch({
        type: 'goodsManage/fetchGoodsUpdataStatus',
        payload: {
          goodsIdString: initialValues.goodsIdString,
          ...payload,
        },
        callback: () => {
          onClose();
          childRef.current.fetchGetData();
        },
      });
    });
  };

  const modalProps = {
    title: `下架原因 - ${initialValues.goodsName}`,
    visible: show,
    width: 520,
    onCancel: onClose,
    footer: (
      <Button type="primary" onClick={fetchStatusClose}>
        确定
      </Button>
    ),
  };

  const formItems = [
    {
      label: '下架原因',
      name: 'offShelfReason',
      type: 'textArea',
      placeholder: '请输入下架原因，以方便商家调整商品信息',
    },
  ];
  
  return (
    <Modal {...modalProps} destroyOnClose>
      <FormCondition
        form={form}
        formItems={formItems}
        initialValues={initialValues}
      ></FormCondition>
    </Modal>
  );
};

export default connect(({ goodsManage, loading }) => ({
  goodsManage,
  loading,
}))(CloseRefuse);
