import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { connect } from 'umi';
import DescriptionsCondition from '@/components/DescriptionsCondition';

const Index = (props) => {
  const { visible = {}, onClose, dispatch, loading, childRef } = props;
  const { show, detail = {} } = visible;

  //立即退款
  const handlePayBack = () => {
    const { orderRefundId, orderSn, userId } = detail;
    dispatch({
      type: 'refundOrder/fetchRefundPayBack',
      payload: {
        orderRefundId,
        orderSn,
        userId,
      },
      callback: () => {
        onClose();
        childRef.current.fetchGetData();
      },
    });
  };
  const refundItem = [
    {
      label: '退款商品 ',
      name: 'orderDesc',
      render: (val) => {
        const goodsInfo = JSON.parse(val) || {};
        const { commerceGoods = {}, specialGoods = {} } = goodsInfo;
        const goodsName = commerceGoods.goodsName || specialGoods.goodsName;
        return goodsName;
      },
    },
    {
      label: '退款数量',
      name: 'refundCount',
    },
    {
      label: '退款原因',
      name: 'refundReason',
    },
    {
      label: '应退金额',
      name: 'refundTotalFee',
    },
    {
      label: '实退金额',
      name: 'refundTotalFee',
    },
    {
      label: '优惠券',
      name: 'businessTime',
    },
  ];

  const modalProps = {
    title: '确认退款',
    visible: show,
    onOk: handlePayBack,
    onCancel: onClose,
    okText: '确认退款',
    confirmLoading: loading,
  };
  return (
    <Modal {...modalProps}>
      <DescriptionsCondition
        labelStyle={{ width: 120 }}
        formItems={refundItem}
        column={1}
        initialValues={detail}
      ></DescriptionsCondition>
    </Modal>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['refundOrder/fetchRefundPayBack'],
}))(Index);
