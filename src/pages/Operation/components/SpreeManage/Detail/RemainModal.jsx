import React from 'react';
import { connect } from 'umi';
import { Form, Modal } from 'antd';
import FormCondition from '@/components/FormCondition';

const RemainModal = (props) => {
  const { visible = {}, onClose, dispatch, loading, childRef } = props;
  const { show = false, platformGiftId, remain } = visible;
  const [form] = Form.useForm();

  const handleOk = () => {
    form.validateFields().then((values) => {
      dispatch({
        type: 'spreeManage/fetchAddTotalPlatformGiftPack',
        payload: {
          platformGiftId,
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
      label: `增加数量`,
      name: 'amount',
      extra: `剩余${remain}`,
      maxLength: 9,
      addRules: [
        {
          validator: (rule, value) => {
            if (value && Number(remain) + Number(value) > 999999) {
              return Promise.reject('库存量不能超过999999');
            }
            if (value && value == 0) {
              return Promise.reject('库存增量不能为0');
            }
            return Promise.resolve();
          },
        },
      ],
    },
  ];

  const modalProps = {
    title: '增加数量',
    visible: show,
    onCancel: onClose,
    onOk: handleOk,
  };
  return (
    <Modal destroyOnClose {...modalProps} loading={loading}>
      <FormCondition form={form} formItems={formItems}></FormCondition>
    </Modal>
  );
};
export default connect(({ loading }) => ({
  loading: loading.effects['spreeManage/fetchAddTotalPlatformGiftPack'],
}))(RemainModal);
