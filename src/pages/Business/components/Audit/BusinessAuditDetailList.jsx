import React from 'react';
import { connect } from 'dva';
import { Modal } from 'antd';
import { ACTIVE_COUPON_STATUS } from '@/common/constant';
import DataTableBlock from '@/components/DataTableBlock';

const BusinessAuditDetailList = (props) => {
  const { businessAudit, loading, visible = null, setVisible } = props;

  const { type = 'detail', record = '' } = visible;

  const loadings =
    loading.effects['businessAudit/fetchGetDetailList'] ||
    loading.effects['businessAudit/fetchActiveDestoryDetail'];

  // 搜索参数
  const propItem = {
    detail: {
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
    loading: loadings,
    columns: propItem.getColumns,
    searchItems: propItem.searchItems,
    params: {
      merchantId: record.merchantIdString,
      marketCouponId: record.marketCouponIdString,
    },
    dispatchType: propItem.dispatchType,
    componentSize: 'middle',
    ...businessAudit.detailList,
  };

  return (
    <Modal
      title={'审核记录'}
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

export default connect(({ businessAudit, loading }) => ({
  businessAudit,
  loading,
}))(BusinessAuditDetailList);
