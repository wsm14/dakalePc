import React, { useRef } from 'react';
import { connect } from 'dva';
import { Modal } from 'antd';
import { ACTIVE_COUPON_STATUS } from '@/common/constant';
import DataTableBlock from '@/components/DataTableBlock';

const MarketCardActivityDetailPay = (props) => {
  const { marketCardActivity, loading, visible, setVisible } = props;

  const { type = '', record = '' } = visible;
  const childRef = useRef();

  const loadings =
    loading.effects['marketCardActivity/fetchGetActiveDetailPay'] ||
    loading.effects['marketCardActivity/fetchActiveDestoryDetail'];

  // 搜索参数
  const propItem = {
    destory: {
      title: `核销明细 - ${record.merchantName}`,
      dispatchType: 'marketCardActivity/fetchActiveDestoryDetail',
      rowKey: 'receiveTime',
      searchItems: [
        {
          label: '核销日期',
          type: 'rangePicker',
          name: 'verifiedBeginDate',
          end: 'verifiedEndDate',
        },
        {
          label: '券状态',
          type: 'select',
          name: 'couponStatus',
          select: { list: ACTIVE_COUPON_STATUS },
        },
      ],
      getColumns: [
        {
          title: '购买日期',
          align: 'center',
          dataIndex: 'receiveTime',
        },
        {
          title: '用户手机',
          align: 'center',
          dataIndex: 'mobile',
        },
        {
          title: '券状态',
          align: 'center',
          dataIndex: 'couponStatus',
          render: (val) => ACTIVE_COUPON_STATUS[val],
        },
        {
          title: '核销日期',
          align: 'center',
          dataIndex: 'verificationTime',
          render: (val) => val || '--',
        },
      ],
    },
    order: {
      title: `订单明细 - ${record.merchantName}`,
      dispatchType: 'marketCardActivity/fetchGetActiveDetailPay',
      rowKey: 'orderSn',
      searchItems: [
        {
          label: '购买日期',
          type: 'rangePicker',
          name: 'beginDate',
          end: 'endDate',
        },
      ],
      getColumns: [
        {
          title: '购买日期',
          align: 'center',
          dataIndex: 'payTime',
        },
        {
          title: '订单号',
          align: 'center',
          dataIndex: 'orderSn',
        },
        {
          title: '用户手机',
          align: 'center',
          dataIndex: 'mobile',
        },
        {
          title: '用户昵称',
          align: 'center',
          dataIndex: 'userName',
        },
        {
          title: '卡豆支付',
          align: 'center',
          dataIndex: 'beanFee',
        },
        {
          title: '优惠券抵扣',
          align: 'center',
          dataIndex: 'couponDeduct',
        },
        {
          title: '现金支付',
          align: 'center',
          dataIndex: 'payFee',
          render: (val) => val || '0',
        },
      ],
    },
  }[type];

  const tableProps = {
    CardNone: false,
    cRef: childRef,
    loading: loadings,
    columns: visible && propItem.getColumns,
    searchItems: visible && propItem.searchItems,
    params: {
      merchantId: record.merchantIdString,
      marketCouponId: record.marketCouponIdString,
    },
    dispatchType: visible && propItem.dispatchType,
    componentSize: 'middle',
    ...marketCardActivity.detailPay,
  };

  return (
    <Modal
      title={visible && propItem.title}
      width={1150}
      destroyOnClose
      footer={null}
      visible={visible}
      onCancel={() => setVisible('')}
    >
      <DataTableBlock {...tableProps} rowKey={(row) => `${row[propItem.rowKey]}`} />
    </Modal>
  );
};

export default connect(({ marketCardActivity, loading }) => ({
  marketCardActivity,
  loading,
}))(MarketCardActivityDetailPay);
