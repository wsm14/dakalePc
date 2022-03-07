import React, { useRef, useEffect } from 'react';
import { connect } from 'umi';
import { WITHDRAW_STATUS } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';

const WithdrawGroup = (props) => {
  const { withdrawDetail, loading, dispatch } = props;

  const childRef = useRef();

  useEffect(() => {
    fetchWithdrawCashTotal();
  }, []);

  // 搜索参数
  const searchItems = [
    {
      label: '提现日期',
      type: 'rangePicker',
      name: 'withdrawalDateStart',
      end: 'withdrawalDateEnd',
    },
    {
      label: '用户账号',
      name: 'merchantAccount',
      placeholder: '请输入用户注册手机号',
    },
    {
      label: '提现账户',
      name: 'merchantAccount',
      placeholder: '请输入用户注册账号',
    },
    {
      label: '用户昵称',
      name: 'merchantAccount',
    },
    {
      label: '提现单号',
      name: 'withdrawalSn',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '流水单号',
      fixed: 'left',
      dataIndex: 'withdrawalSn',
    },
    {
      title: '提现日期',
      fixed: 'left',
      dataIndex: 'withdrawalDate',
    },
    {
      title: '需提现金额',
      dataIndex: 'merchantName',
    },
    {
      title: '服务费(6‰)',
      dataIndex: 'withdrawalHandlingFee',
      render: (val) => `￥0`,
    },
    {
      title: '卡豆抵扣',
      dataIndex: 'districtCode',
    },
    {
      title: '实际提现金额',
      align: 'center',
      dataIndex: 'withdrawalFee',
      render: (val) => `￥ ${(Number(val) || 0).toFixed(2)}`,
    },
    {
      title: '提现账户',
      align: 'right',
      dataIndex: 'withdrawalAccount',
      render: (val, row) => `${row.withdrawalChannelName}\n${val}`,
    },
    {
      title: '用户昵称',
      align: 'right',
      dataIndex: 'withdrawalFee',
    },
    {
      title: '用户账号',
      align: 'right',
      dataIndex: 'merchantAccount',
    },
    {
      title: '审核时间',
      dataIndex: 'status',
    },
    {
      title: '状态',
      align: 'right',
      fixed: 'right',
      dataIndex: 'status',
      render: (val) => WITHDRAW_STATUS[val],
    },
  ];

  // 统计数据
  const fetchWithdrawCashTotal = (payload = {}) => {
    dispatch({
      type: 'withdrawDetail/fetchWithdrawCashTotal',
      payload,
    });
  };

  return (
    <>
      <TableDataBlock
        order
        cRef={childRef}
        noCard={false}
        searchCallback={fetchWithdrawCashTotal}
        loading={loading.effects['withdrawDetail/fetchGetCashList']}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.directWithdrawalId}`}
        dispatchType="withdrawDetail/fetchGetCashList"
        {...withdrawDetail.listCash}
      ></TableDataBlock>
    </>
  );
};

export default connect(({ withdrawDetail, loading }) => ({
  withdrawDetail,
  loading,
}))(WithdrawGroup);
