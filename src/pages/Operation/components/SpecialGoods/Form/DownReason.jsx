import React from 'react';
import { connect } from 'umi';
import { Modal, Form } from 'antd';
import FormCondition from '@/components/FormCondition';

const DownReason = (props) => {
  const { dispatch, childRef, visible, onClose, loading } = props;
  const { show = false, initialValues = {} } = visible;
  
  const [form] = Form.useForm();

  // 下架
//   const fetchStatusClose = () => {
//     form.validateFields().then((payload) => {
//       const { goodsIdString } = initialValues;
//       dispatch({
//         type: 'goodsManage/fetchGoodsUpdataStatus',
//         payload: { goodsIdString, ...payload },
//         callback: () => {
//           onClose();
//           childRef.current.fetchGetData();
//         },
//       });
//     });
//   };

  const formItems = [
    {
      label: '下架原因',
      name: 'reason',
      type: 'textArea',
      required: true,
      maxLength: 50,
      placeholder: '请输入下架原因',
    },
  ];

  const modalProps = {
    title: `下架原因`,
    visible: show,
    width: 520,
    onCancel: onClose,
    confirmLoading: loading,
    // onOk: fetchStatusClose,
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
}))(DownReason);
