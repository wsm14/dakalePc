import React from 'react';
import { connect } from 'dva';
import { Modal } from 'antd';
import { COLLECT_STATUS } from '@/common/constant';
import DataTableBlock from '@/components/DataTableBlock';
import BusinessOrderDetail from '../CheckOrderDetail';

const BusinessDetailList = (props) => {
  const { detailList, loading, visible, setVisible } = props;

  const { type = 'peas', record = '' } = visible;

  // table
  const propItem = {
    peas: {
      title: `卡豆明细 - 商户ID：${record.userMerchantIdString} 商户名称：${record.merchantName}`,
      rowKey: 'createTime',
      getColumns: [
        {
          title: '日期',
          align: 'center',
          dataIndex: 'createTime',
        },
        {
          title: '事件',
          align: 'center',
          dataIndex: 'detailTitle',
        },
        {
          title: '关联用户',
          align: 'center',
          dataIndex: 'detailContent',
          render: (val) => val || '--',
        },
        {
          title: '卡豆明细',
          align: 'center',
          dataIndex: 'beanAmount',
          render: (val, row) => `${row.detailType === 'add' ? '+' : '-'}${val}`,
        },
        {
          title: '收支状态',
          align: 'center',
          dataIndex: 'detailType',
          render: (val) => (val === 'add' ? '收入' : '支出'),
        },
        {
          title: '关联订单',
          align: 'center',
          dataIndex: 'identification',
          render: (val, record) => <BusinessOrderDetail order={val} />,
        },
      ],
    },
    collect: {
      title: `提现记录 - 商户ID：${record.userMerchantIdString} 商户名称：${
        record.merchantName
      } 累计提现：${record.totalConsume / 100}元（${record.totalConsume}卡豆）`,
      rowKey: 'withdrawalSn',
      getColumns: [
        {
          title: '提现日期',
          dataIndex: 'createTime',
        },
        {
          title: '提现单号',
          dataIndex: 'incomeSn',
        },
        {
          title: '订单流水',
          dataIndex: 'withdrawalSn',
        },
        {
          title: '提现卡豆',
          align: 'right',
          dataIndex: 'withdrawalBeanAmount',
        },
        {
          title: '提现到',
          align: 'right',
          dataIndex: 'withdrawalChannelName',
        },
        {
          title: '提现状态',
          align: 'center',
          dataIndex: 'status',
          render: (val) => COLLECT_STATUS[val],
        },
        {
          title: '到账日期',
          align: 'center',
          dataIndex: 'finishTime',
        },
      ],
    },
    recharge: {
      title: `充值记录 - 商户ID：${record.userMerchantIdString} 商户名称：${record.merchantName} 累计充值：${record.totalCharge}元`,
      rowKey: 'orderSn',
      getColumns: [
        {
          title: '日期',
          align: 'center',
          dataIndex: 'payTime',
        },
        {
          title: '充值单号',
          align: 'center',
          dataIndex: 'orderSn',
        },
        {
          title: '订单流水',
          align: 'center',
          dataIndex: 'paySn',
        },
        {
          title: '充值卡豆数',
          align: 'center',
          dataIndex: 'beanAmount',
        },
        {
          title: '充值金额',
          align: 'center',
          dataIndex: 'totalFee',
        },
        {
          title: '支付方式',
          align: 'center',
          dataIndex: 'payType',
          render: (val) => (val === 'wx_lite' ? '微信' : '支付宝'),
        },
        {
          title: '支付状态',
          align: 'center',
          dataIndex: 'beanStatus',
          render: () => '支付成功',
        },
        {
          title: '卡豆状态',
          align: 'center',
          dataIndex: 'status',
          render: () => '已到账',
        },
      ],
    },
  }[type];

  return (
    <Modal
      title={propItem.title}
      width={1150}
      destroyOnClose
      footer={null}
      visible={visible}
      onCancel={() => setVisible('')}
    >
      <DataTableBlock
        CardNone={false}
        loading={loading}
        columns={propItem.getColumns}
        rowKey={(row, i) => `${row[propItem.rowKey] + i}`}
        params={{
          type,
          ...{
            peas: { merchantId: record.userMerchantIdString },
            collect: { merchantId: record.userMerchantIdString },
            recharge: { userId: record.userMerchantIdString, userType: 'merchant' },
          }[type],
        }}
        dispatchType="accountBusiness/fetchDetailList"
        componentSize="middle"
        {...detailList}
      ></DataTableBlock>
    </Modal>
  );
};

export default connect(({ accountBusiness, loading }) => ({
  detailList: accountBusiness.detailList,
  loading: loading.effects['accountBusiness/fetchDetailList'],
}))(BusinessDetailList);
