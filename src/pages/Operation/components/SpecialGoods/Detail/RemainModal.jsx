import React from 'react';
import { connect } from 'umi';
import { Form, Modal } from 'antd';
import FormCondition from '@/components/FormCondition';

const RemainModal = (props) => {
  const { visible = {}, onClose, dispatch, loading, childRef } = props;
  const { show = false, id, ownerId, remain } = visible;
  const [form] = Form.useForm();

  const handleOk = () => {
    form.validateFields().then((values) => {
      dispatch({
        type: 'specialGoods/fetchSpecialGoodsAddRemain',
        payload: {
          stockUpdateReqs: {
            stockId: id,
            ownerId,
            ...values,
          },
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
      label: `调整库存`,
      name: 'goodsCount',
      placeholder: `请输入调整后的库存`,
      extra: `剩余${remain}`,
      maxLength: 6,
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
    title: '调整库存',
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
  loading: loading.effects['specialGoods/fetchSpecialGoodsAddRemain'],
}))(RemainModal);
