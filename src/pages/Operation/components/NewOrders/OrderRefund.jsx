import React, { useState } from 'react';
import { connect } from 'umi';
import { Modal, Form } from 'antd';
import FormCondition from '@/components/FormCondition';
import aliOssUpload from '@/utils/aliOssUpload';

/**
 * 订单退款
 */
const OrderRefund = (props) => {
  const { visible = {}, onClose, getDetail, dispatch, loading } = props;
  const { show = false, detail = {} } = visible;
  const { orderType } = detail;

  const [form] = Form.useForm();

  // 确认提交
  const handleUpAudit = () => {
    form.validateFields().then(async (values) => {
      const { refundReason, payFee, refundImg, ...other } = values;

      const rImg = await aliOssUpload(refundImg);

      dispatch({
        type: 'ordersList/fetchOrderImmediateRefund',
        payload: {
          ...detail,
          ...other,
          refundImg: rImg.toString() || undefined,
          refundReason: select[refundReason],
        },
        callback: () => {
          onClose();
          getDetail();
        },
      });
    });
  };

  const select = ['买多了/买错了', '临时有变', '商家表示不可用', '没货了', '预约失败', '其他原因'];
  const selectType = {
    onlyFee: '仅退款',
    goodsAFee: '退货退款',
  };

  const formItems = [
    {
      label: '退款类型',
      name: 'refundType',
      type: 'select',
      select: selectType,
      visible: orderType == 'commerceGoods',
    },
    {
      label: '退款原因',
      name: 'refundReason',
      type: 'select',
      select: select,
    },
    {
      label: '退款金额',
      name: 'payFee',
      type: 'number',
      addonBefore: '￥',
      disabled: true,
    },
    {
      label: `补充描述`,
      name: 'refundDesc',
      type: 'textArea',
      maxLength: 200,
      rules: [{ required: false }],
    },
    {
      label: `补充凭证`,
      name: 'refundImg',
      type: 'upload',
      maxFile: 1,
      rules: [{ required: false }],
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
      <FormCondition form={form} formItems={formItems} initialValues={detail}></FormCondition>
      提示：确定退款后系统将在5分钟内自动完成退款。确定后不可取消，资金将原路退回付款账户。
    </Modal>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['ordersList/fetchOrderRefundOwn'],
}))(OrderRefund);
