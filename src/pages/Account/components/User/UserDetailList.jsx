import React from 'react';
import { connect } from 'dva';
import { Modal } from 'antd';
import { MATCH_USER_STATUS } from '@/common/constant';
import DataTableBlock from '@/components/DataTableBlock';
import UserOrderDetail from './UserOrderDetail';

const UserDetailList = (props) => {
  const { detailList, loading, visible, setVisible } = props;

  const { type = 'peas', record = '' } = visible;

  // table
  const propItem = {
    peas: {
      title: `卡豆明细 - 用户ID：0001 用户昵称：小王`,
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
          title: '关联店铺',
          align: 'center',
          dataIndex: 'status',
        },
        {
          title: '卡豆明细',
          align: 'center',
          dataIndex: 'earnBeanAmount',
        },
        {
          title: '收支状态',
          align: 'center',
          dataIndex: 'signDate',
          render: (val) => MATCH_USER_STATUS[val],
        },
        {
          title: '关联订单',
          align: 'center',
          dataIndex: 'order',
          render: (val) => <UserOrderDetail order={val}></UserOrderDetail>,
        },
      ],
    },
    recharge: {
      title: `充值记录 - 用户ID：0001 用户昵称：小王 累计充值：1200元`,
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
          align: 'center',
          dataIndex: 'status',
        },
        {
          title: '充值卡豆数',
          align: 'right',
          dataIndex: 'earnBeanAmount',
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
          dataIndex: 'processs',
          render: (val) => MATCH_USER_STATUS[val],
        },
        {
          title: '卡豆状态',
          align: 'center',
          dataIndex: 'processs',
          render: (val) => MATCH_USER_STATUS[val],
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
        dispatchType="accountUser/fetchDetailList"
        componentSize="middle"
        {...detailList}
      ></DataTableBlock>
    </Modal>
  );
};

export default connect(({ accountUser, loading }) => ({
  detailList: accountUser.detailList,
  loading: loading.effects['accountUser/fetchDetailList'],
}))(UserDetailList);
