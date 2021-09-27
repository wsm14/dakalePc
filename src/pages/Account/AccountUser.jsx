import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import TableDataBlock from '@/components/TableDataBlock';
import UserDetailList from './components/User/UserDetailList';
import UserTotalInfo from './components/User/UserTotalInfo';

const AccountUserList = (props) => {
  const { userlist, loading, dispatch, kolLevel } = props;

  const [visible, setVisible] = useState('');

  useEffect(() => {
    fetchGetKolLevel();
  }, []);

  // 获取哒人等级数据
  const fetchGetKolLevel = () => {
    dispatch({
      type: 'baseData/fetchGetKolLevel',
    });
  };

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
    {
      label: '用户等级',
      name: 'level',
      type: 'select',
      select: kolLevel,
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
      title: '豆号',
      align: 'center',
      dataIndex: 'beanCode',
    },
    {
      title: '手机号',
      align: 'center',
      dataIndex: 'mobile',
    },
    {
      title: '用户级别',
      align: 'center',
      dataIndex: 'levelName',
    },
    {
      title: '累计提现（卡豆）',
      align: 'center',
      dataIndex: 'totalWithdrawBean',
    },
    {
      title: '累计支出（卡豆）',
      align: 'right',
      dataIndex: 'totalExpendBean',
      render: (val) => val || 0,
    },
    {
      title: '累计奖励（卡豆）',
      align: 'right',
      dataIndex: 'totalRewardBean',
      render: (val) => val || 0,
    },
    {
      title: '累计收益（卡豆）',
      align: 'right',
      dataIndex: 'totalIncomeBean',
      render: (val) => val || 0,
    },
    {
      title: '累计充值',
      align: 'right',
      dataIndex: 'totalCharge',
      render: (val) => val || 0,
    },

    {
      title: '奖励卡豆余额',
      align: 'right',
      dataIndex: 'bean',
      render: (val) => val || 0,
    },
    {
      title: '收益卡豆余额',
      align: 'right',
      dataIndex: 'incomeBean',
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

export default connect(({ accountUser, loading, baseData }) => ({
  userlist: accountUser.userlist,
  kolLevel: baseData.kolLevel,
  loading: loading.effects['accountUser/fetchGetList'],
}))(AccountUserList);
