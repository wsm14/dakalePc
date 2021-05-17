import React from 'react';
import { PAY_TYPE } from '@/common/constant';
import DrawerCondition from '@/components/DrawerCondition';
import FormCondition from '@/components/FormCondition';
import DescriptionsCondition from '@/components/DescriptionsCondition';

const OrderDetailDraw = (props) => {
  const { visible, onClose, getDetail, total } = props;
  const { detail = {}, show = false, index } = visible;
  const { verificationTime } = detail;
  const formItems = [
    {
      label: '订单商品',
      name: 'name',
    },
    {
      label: '店铺名称 ',
      name: 'merchantName',
    },
    {
      label: '店铺地址',
      name: 'address',
    },
    {
      label: '订单金额',
      name: 'totalFee',
      render: (val) => (val ? `￥${val}` : '0'),
    },
    {
      label: '卡豆抵扣',
      name: 'beanFee',
      render: (val, row) => (
        <span>{val && val != '--' ? ` ${val}卡豆（-￥${val / 100}）` : '--'}</span>
      ),
    },
    {
      label: '优惠券',
      name: 'reduceFee',
      render: (val) => (val && val !== '--' ? `${val}元抵扣券（-￥${val || 0}）` : '--'),
    },
    {
      label: '实付金额',
      name: 'payFee',
      render: (val) => (val ? `￥${val}` : '0'),
    },
    {
      label: '订单号',
      name: 'orderSn',
    },
    {
      label: '支付方式',
      name: 'payType',
      render: (val) => PAY_TYPE[val],
    },
    {
      label: '创建时间',
      name: 'createTime',
    },
    {
      label: '支付时间',
      name: 'payTime',
    },
    {
      label: '核销时间',
      name: 'verificationTime',
      show: verificationTime,
    },
  ];
  const modalProps = {
    title: '订单详情',
    visible: show,
    onClose,
    dataPage: {
      current: index,
      total,
      onChange: (size) => getDetail(size),
    },
  };
  return (
    <DrawerCondition {...modalProps}>
      <DescriptionsCondition formItems={formItems} initialValues={detail}></DescriptionsCondition>
    </DrawerCondition>
  );
};
export default OrderDetailDraw;
