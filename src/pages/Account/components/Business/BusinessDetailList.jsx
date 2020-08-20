import React from 'react';
import { connect } from 'dva';
import { Modal } from 'antd';
import { MATCH_USER_STATUS } from '@/common/constant';
import DataTableBlock from '@/components/DataTableBlock';
import BusinessOrderDetail from './BusinessOrderDetail';

const BusinessDetailList = (props) => {
  const { detailList, loading, visible, setVisible } = props;

  const { type = 'peas', record = '' } = visible;

  // table
  const propItem = {
    peas: {
      title: `卡豆明细 - 商户ID：0001 商户名称：小王的店`,
      rowKey: '',
      getColumns: [
        {
          title: '日期',
          align: 'center',
          dataIndex: 'userId',
        },
        {
          title: '事件',
          align: 'center',
          dataIndex: 'username',
        },
        {
          title: '关联用户',
          align: 'center',
          dataIndex: 'status',
        },
        {
          title: '卡豆明细',
          align: 'center',
          dataIndex: 'earnBeanAmount',
          render: (val) => MATCH_USER_STATUS[val],
        },
        {
          title: '收支状态',
          align: 'center',
          dataIndex: 'signDate',
        },
        {
          title: '关联订单',
          align: 'center',
          dataIndex: 'order',
          render: (val, record) => <BusinessOrderDetail order={val} />,
        },
      ],
    },
    collect: {
      title: `提现记录 - 商户ID：0001 商户名称：小王的店 累计充值：1200元`,
      rowKey: '',
      getColumns: [
        {
          title: '日期',
          dataIndex: 'userId',
        },
        {
          title: '充值单号',
          dataIndex: 'username',
        },
        {
          title: '订单流水',
          dataIndex: 'status',
        },
        {
          title: '充值卡豆数',
          align: 'right',
          dataIndex: 'earnBeanAmount',
          render: (val) => MATCH_USER_STATUS[val],
        },
        {
          title: '充值金额',
          align: 'right',
          dataIndex: 'signDate',
        },
        {
          title: '支付方式',
          align: 'center',
          dataIndex: 'process',
          render: (val) => MATCH_USER_STATUS[val],
        },
        {
          title: '支付状态',
          align: 'center',
          dataIndex: 'processss',
          render: (val) => MATCH_USER_STATUS[val],
        },
        {
          title: '卡豆状态',
          align: 'center',
          dataIndex: 'procsesss',
          render: (val) => MATCH_USER_STATUS[val],
        },
      ],
    },
    recharge: {
      title: `充值记录 - 商户ID：0001 商户名称：小王 累计提现：1200元（12000卡豆）`,
      rowKey: '',
      getColumns: [
        {
          title: '提现日期',
          align: 'center',
          dataIndex: 'userId',
        },
        {
          title: '提现单号',
          align: 'center',
          dataIndex: 'username',
        },
        {
          title: '订单流水',
          align: 'center',
          dataIndex: 'status',
        },
        {
          title: '提现卡豆',
          align: 'center',
          dataIndex: 'earnBeanAmount',
          render: (val) => val || '--',
        },
        {
          title: '提现到',
          align: 'center',
          dataIndex: 'signDate',
          render: (val) => val || '--',
        },
        {
          title: '提现状态',
          align: 'center',
          dataIndex: 'sigsnDate',
          render: (val) => val || '--',
        },
        {
          title: '到账日期',
          align: 'center',
          dataIndex: 'signDate',
          render: (val) => val || '--',
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
        rowKey={(row) => `${row[propItem.rowKey]}`}
        params={{ type }}
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
