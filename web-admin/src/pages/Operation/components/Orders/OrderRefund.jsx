import React, { useState } from 'react';
import { connect } from 'umi';
import { Modal, Form } from 'antd';
import FormCondition from '@/components/FormCondition';

/**
 * 订单退款
 */
const OrderRefund = (props) => {
  const { visible = {}, onClose, getDetail, dispatch, loading } = props;
  const { show = false, detail = {} } = visible;

  const [form] = Form.useForm();
  const [refund, setRefund] = useState(undefined);

  // 确认提交
  const handleUpAudit = () => {
    form.validateFields().then((values) => {
      const { refundType, refundReason } = values;
      dispatch({
        type: 'ordersList/fetchOrderRefundOwn',
        payload: {
          ...detail,
          status: 6,
          refundReason: refundType !== '5' ? select[refundType] : refundReason,
        },
        callback: () => {
          onClose();
          getDetail();
        },
      });
    });
  };

  const select = ['买多了/买错了', '临时有变', '商家表示不可用', '没货了', '预约失败', '其他原因'];

  const formItems = [
    {
      label: '退款原因',
      name: 'refundType',
      type: 'select',
      select: select,
      onChange: (val) => setRefund(val),
    },
    // {
    //   label: '退款卡豆数',
    //   name: 'refundNumber',
    //   type: 'number',
    // },
    {
      label: `具体退款原因`,
      name: 'refundReason',
      type: 'textArea',
      maxLength: 50,
      visible: refund === '5',
    },
  ];

  const modalProps = {
    title: `请填写退款的原因`,
    width: 500,
    visible: show,
    maskClosable: true,
    destroyOnClose: true,
    zIndex: 1001,
    confirmLoading: loading,
  };

  return (
    <Modal {...modalProps} onCancel={onClose} onOk={handleUpAudit}>
      <FormCondition form={form} formItems={formItems}></FormCondition>
      提示：确定退款后系统将在5分钟内自动完成退款。确定后不可取消，资金将原路退回付款账户。
    </Modal>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['ordersList/fetchOrderRefundOwn'],
}))(OrderRefund);
