import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import TableDataBlock from '@/components/TableDataBlock';
import UserDetailList from './components/User/UserDetailList';
import UserTotalInfo from './components/User/UserTotalInfo';

const AccountUserList = (props) => {
  const { userlist, loading, dispatch } = props;

  const [visible, setVisible] = useState('');

  // 搜索参数
  const searchItems = [
    {
      label: '用户昵称',
      name: 'username',
    },
    {
      label: '手机号',
      name: 'mobile',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '用户ID',
      fixed: 'left',
      dataIndex: 'userIdString',
    },
    {
      title: '用户昵称',
      align: 'center',
      dataIndex: 'username',
      render: (val) => val || '--',
    },
    {
      title: '累计收益（卡豆）',
      align: 'right',
      dataIndex: 'totalAdd',
      render: (val) => val || 0,
    },
    {
      title: '累计充值',
      align: 'right',
      dataIndex: 'totalCharge',
      render: (val) => val || 0,
    },
    {
      title: '累计支出（金额）',
      align: 'right',
      dataIndex: 'totalConsume',
      render: (val) => val || 0,
    },
    {
      title: '当前余额（卡豆）',
      align: 'right',
      dataIndex: 'bean',
      render: (val) => val || 0,
    },
    {
      dataIndex: 'id',
      type: 'handle',
      render: (val, record) => [
        {
          auth: 'peasDetail',
          title: '卡豆明细',
          click: () => setVisible({ type: 'peas', record }),
        },
        {
          auth: 'rechargeDetail',
          title: '充值记录',
          click: () => setVisible({ type: 'recharge', record }),
        },
      ],
    },
  ];

  useEffect(() => {
    dispatch({
      type: 'accountUser/clearDetail',
    });
  }, [visible]);

  return (
    <>
      <UserTotalInfo></UserTotalInfo>
      <TableDataBlock
        keepData
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.userIdString}`}
        dispatchType="accountUser/fetchGetList"
        {...userlist}
      ></TableDataBlock>
      <UserDetailList visible={visible} setVisible={setVisible}></UserDetailList>
    </>
  );
};

export default connect(({ accountUser, loading }) => ({
  userlist: accountUser.userlist,
  loading: loading.effects['accountUser/fetchGetList'],
}))(AccountUserList);
