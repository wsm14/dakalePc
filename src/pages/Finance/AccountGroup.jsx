import React from 'react';
import { connect } from 'umi';
import TableDataBlock from '@/components/TableDataBlock';

const AccountUserList = (props) => {
  const { grouplist, loading } = props;

  // 搜索参数
  const searchItems = [
    {
      label: '集团名称',
      name: 'groupName',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '集团ID',
      fixed: 'left',
      dataIndex: 'merchantGroupIdString',
    },
    {
      title: '集团名称',
      align: 'center',
      dataIndex: 'groupName',
    },
    {
      title: '累计收益（卡豆）',
      align: 'right',
      dataIndex: 'totalIncomeBean',
      render: (val) => val || 0,
    },
    {
      title: '累计提现（卡豆）',
      align: 'center',
      dataIndex: 'totalWithdrawBean',
    },
    {
      title: '累计充值（卡豆）',
      align: 'right',
      dataIndex: 'totalRechargeBean',
      render: (val) => val || 0,
    },
    {
      title: '累计收益（现金）',
      align: 'right',
      dataIndex: 'totalDirectCash',
      render: (val) => `￥${(Number(val) || 0).toFixed(2)}`,
    },
    {
      title: '累计提现（现金）',
      align: 'right',
      dataIndex: 'totalWithdrawFee',
      render: (val) => `￥${(Number(val) || 0).toFixed(2)}`,
    },
    {
      title: '收益卡豆余额',
      align: 'right',
      dataIndex: 'bean',
      render: (val) => val || 0,
    },
    {
      title: '营销卡豆余额',
      align: 'right',
      dataIndex: 'platformBean',
      render: (val) => val || 0,
    },
    {
      title: '现金账户余额',
      align: 'right',
      dataIndex: 'directCash',
      render: (val) => `￥${(Number(val) || 0).toFixed(2)}`,
    },
    // {
    //   title: '操作',
    //   dataIndex: 'id',
    //   type: 'handle',
    //   render: (val, record) => [
    //     {
    //       auth: 'info',
    //     },
    //   ],
    // },
  ];

  return (
    <>
      <TableDataBlock
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.merchantGroupIdString}`}
        dispatchType="accountGroup/fetchGetList"
        {...grouplist}
      ></TableDataBlock>
    </>
  );
};

export default connect(({ accountGroup, loading }) => ({
  grouplist: accountGroup.list,
  loading: loading.effects['accountGroup/fetchGetList'],
}))(AccountUserList);
