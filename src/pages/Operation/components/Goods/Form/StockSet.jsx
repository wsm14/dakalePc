import React from 'react';
import { connect } from 'umi';
import { Modal, Form } from 'antd';
import FormCondition from '@/components/FormCondition';

const StockSet = (props) => {
  const { dispatch, childRef, visible, onClose, loading } = props;
  const { show = false, initialValues = {} } = visible;
  const [form] = Form.useForm();

  // 下架
  const fetchStatusClose = () => {
    form.validateFields().then((payload) => {
      dispatch({
        type: 'goodsManage/fetchUpdataStock',
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

  const formItems = [
    {
      label: '可用库存',
      name: 'stock',
      type: 'number',
      max: 100000,
      min: 0,
      precision: 0,
    },
  ];

  const modalProps = {
    title: `库存 - ${initialValues.goodsName}`,
    visible: show,
    width: 550,
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
  loading: loading.effects['goodsManage/fetchUpdataStock'],
}))(StockSet);
