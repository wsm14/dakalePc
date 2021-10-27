import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'umi';
import { Modal } from 'antd';
import TableDataBlock from '@/components/TableDataBlock';
import UserOrderDetail from '../CheckOrderDetail';

const UserDetailList = (props) => {
  const { detailList, loading, visible, setVisible } = props;

  const { type = 'peas', record = '' } = visible;

  const childRef = useRef();

  const [tabKey, setTabKey] = useState('award');

  const tabList = [
    {
      key: 'award',
      tab: '奖励卡豆',
    },
    {
      key: 'earn',
      tab: '现金收益',
    },
  ];
  useEffect(() => {
    if (type === 'peas') {
      childRef.current?.fetchGetData();
    }
  }, [tabKey]);
  // table
  const propItem = {
    peas: {
      title: `卡豆明细 - 用户ID：${record.userIdString} 用户昵称：${record.username}`,
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
          title: '关联店铺',
          align: 'center',
          dataIndex: 'detailContent',
          render: (val) => val || '--',
        },
        {
          title: tabKey === 'earn' ? '现金明细' : '卡豆明细',
          align: 'center',
          dataIndex: 'beanAmount',
          render: (val, row) =>
            `${row.detailType === 'add' ? '+' : '-'}${
              tabKey === 'earn' ? (val / 100).toFixed(2) : val
            }`,
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
          render: (val) => <UserOrderDetail order={val}></UserOrderDetail>,
        },
      ],
    },
    recharge: {
      title: `充值记录 - 用户ID：${record.userIdString} 用户昵称：${record.username} 累计充值：${record.totalCharge}元`,
      rowKey: 'orderSn',
      getColumns: [
        {
          title: '日期',
          dataIndex: 'payTime',
        },
        {
          title: '充值单号',
          dataIndex: 'orderSn',
        },
        {
          title: '订单流水',
          align: 'center',
          dataIndex: 'paySn',
        },
        {
          title: '充值卡豆数',
          align: 'right',
          dataIndex: 'beanAmount',
        },
        {
          title: '充值金额',
          align: 'right',
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
      <TableDataBlock
        cRef={childRef}
        cardProps={
          type === 'peas' && { tabList: tabList, activeTabKey: tabKey, onTabChange: setTabKey }
        }
        loading={loading}
        columns={propItem.getColumns}
        rowKey={(row, i) => `${row[propItem.rowKey]}${i}`}
        params={{ type, tabKey, userType: 'user', userId: record.userIdString }}
        dispatchType="accountUser/fetchDetailList"
        size="middle"
        {...detailList}
      ></TableDataBlock>
    </Modal>
  );
};

export default connect(({ accountUser, loading }) => ({
  detailList: accountUser.detailList,
  loading: loading.effects['accountUser/fetchDetailList'],
}))(UserDetailList);
