import React from 'react';
import { connect } from 'umi';
import { Modal, Form } from 'antd';
import FormCondition from '@/components/FormCondition';

const CloseRefuse = (props) => {
  const { dispatch, childRef, visible, onClose, loading } = props;
  const { show = false, initialValues = {} } = visible;
  
  const [form] = Form.useForm();

  // 下架
  const fetchStatusClose = () => {
    form.validateFields().then((payload) => {
      const { goodsIdString } = initialValues;
      dispatch({
        type: 'goodsManage/fetchGoodsUpdataStatus',
        payload: { goodsIdString, ...payload },
        callback: () => {
          onClose();
          childRef.current.fetchGetData();
        },
      });
    });
  };

  const formItems = [
    {
      label: '下架原因',
      name: 'offShelfReason',
      type: 'textArea',
      placeholder: '请输入下架原因，以方便商家调整商品信息',
    },
  ];

  const modalProps = {
    title: `下架原因 - ${initialValues.goodsName}`,
    visible: show,
    width: 520,
    onCancel: onClose,
    confirmLoading: loading,
    onOk: fetchStatusClose,
  };

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

export default connect(({ loading }) => ({
  loading: loading.effects['goodsManage/fetchGoodsUpdataStatus'],
}))(CloseRefuse);
