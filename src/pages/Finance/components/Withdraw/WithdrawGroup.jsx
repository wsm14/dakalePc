import React, { useRef } from 'react';
import { connect } from 'umi';
import { WITHDRAW_STATUS } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';

const WithdrawGroup = (props) => {
  const { withdrawDetail, loading } = props;

  const childRef = useRef();

  // 搜索参数
  const searchItems = [
    {
      label: '提现日期',
      type: 'rangePicker',
      name: 'beginDate',
      end: 'endDate',
    },
    {
      label: '用户账号',
      name: 'mobile',
      placeholder: '请输入用户注册手机号',
    },
    {
      label: '提现账户',
      name: 'withdrawalAccount',
      placeholder: '请输入用户注册账号',
    },
    {
      label: '用户昵称',
      name: 'username',
    },
    {
      label: '提现单号',
      name: 'incomeSn',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '流水单号',
      fixed: 'left',
      dataIndex: 'incomeSn',
    },
    {
      title: '提现日期',
      fixed: 'left',
      dataIndex: 'createTime',
    },
    {
      title: '需提现金额',
      align: 'right',
      dataIndex: 'withdrawalFee',
      render: (val) => `￥${val}`,
    },
    {
      title: '服务费(6‰)',
      align: 'right',
      dataIndex: 'chargeCash',
      render: (val) => `-￥${val}`,
    },
    {
      title: '卡豆抵扣',
      align: 'right',
      dataIndex: 'chargeBean',
      render: (val) => (Number(val) > 0 ? `${val}豆\n(￥${val / 100})` : 0),
    },
    {
      title: '实际提现金额',
      align: 'right',
      dataIndex: 'totalFee',
      render: (val) => `￥${val}`,
    },
    {
      title: '提现账户',
      align: 'center',
      dataIndex: 'withdrawalAccount',
      render: (val, row) => `${row.withdrawalChannelName}\n${val}`,
    },
    {
      title: '用户昵称',
      align: 'center',
      dataIndex: 'username',
    },
    {
      title: '用户账号',
      align: 'center',
      dataIndex: 'mobile',
    },
    {
      title: '审核时间',
      dataIndex: 'auditTime',
    },
    {
      title: '状态',
      align: 'right',
      fixed: 'right',
      dataIndex: 'status',
      render: (val) => (val == 4 ? '发起提现失败' : '发起提现成功'),
    },
  ];

  return (
    <TableDataBlock
      order
      cRef={childRef}
      noCard={false}
      loading={loading.effects['withdrawDetail/fetchWithdrawGroupList']}
      columns={getColumns}
      searchItems={searchItems}
      rowKey={(record) => `${record.directWithdrawalId}`}
      dispatchType="withdrawDetail/fetchWithdrawGroupList"
      {...withdrawDetail.grouplist}
    ></TableDataBlock>
  );
};

export default connect(({ withdrawDetail, loading }) => ({
  withdrawDetail,
  loading,
}))(WithdrawGroup);
