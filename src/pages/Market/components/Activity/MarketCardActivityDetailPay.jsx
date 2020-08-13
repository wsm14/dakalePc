import React, { useRef } from 'react';
import { connect } from 'dva';
import { Modal } from 'antd';
import DataTableBlock from '@/components/DataTableBlock';

const MarketCardActivityDetailPay = (props) => {
  const { marketCardActivity, loading, visible, setVisible } = props;

  const { type = '', record = '' } = visible;
  const childRef = useRef();

  // 搜索参数
  const propItem = {
    destory: {
      title: `核销明细 - ${record.merchantName}`,
      searchItems: [
        {
          label: '核销日期',
          type: 'rangePicker',
          name: 'dates',
        },
        {
          label: '券状态',
          type: 'select',
          name: 'datess',
          select: { list: [] },
        },
      ],
      getColumns: [
        {
          title: '购买日期',
          align: 'center',
          dataIndex: 'startDate',
        },
        {
          title: '用户手机',
          align: 'center',
          dataIndex: 'signBeanAmount',
        },
        {
          title: '券状态',
          align: 'center',
          dataIndex: 'signAmount',
        },
        {
          title: '核销日期',
          align: 'center',
          dataIndex: 'totalBeanAmount',
          render: (val) => val || '--',
        },
      ],
    },
    order: {
      title: `订单明细 - ${record.merchantName}`,
      searchItems: [
        {
          label: '购买日期',
          type: 'rangePicker',
          name: 'dates',
        },
      ],
      getColumns: [
        {
          title: '购买日期',
          align: 'center',
          dataIndex: 'startDate',
        },
        {
          title: '订单号',
          align: 'center',
          dataIndex: 'startDate',
        },
        {
          title: '用户手机',
          align: 'center',
          dataIndex: 'signBeanAmount',
        },
        {
          title: '用户昵称',
          align: 'center',
          dataIndex: 'signAmount',
        },
        {
          title: '卡豆支付',
          align: 'center',
          dataIndex: 'totalBeanAmount',
        },
        {
          title: '优惠券抵扣',
          align: 'center',
          dataIndex: 'totalBesaanAmount',
        },
        {
          title: '现金支付',
          align: 'center',
          dataIndex: 'totalBeanAasmount',
        },
      ],
    },
  }[type];

  return (
    <Modal
      title={visible && propItem.title}
      width={1150}
      destroyOnClose
      footer={null}
      visible={visible}
      onCancel={() => setVisible('')}
    >
      <DataTableBlock
        CardNone={false}
        cRef={childRef}
        loading={loading}
        columns={visible && propItem.getColumns}
        searchItems={visible && propItem.searchItems}
        rowKey={(record) => `${record.startDate}`}
        // params={{ id: params.id }}
        dispatchType="marketCardActivity/fetchGetActiveDetailPays"
        componentSize="middle"
        {...marketCardActivity.detailPay}
      ></DataTableBlock>
    </Modal>
  );
};

export default connect(({ marketCardActivity, loading }) => ({
  marketCardActivity,
  loading: loading.effects['marketCardActivity/fetchGetActiveDetailPay'],
}))(MarketCardActivityDetailPay);
