import React, { useState, useEffect, lazy, Suspense } from 'react';
import { connect } from 'dva';
import { useLocation } from 'umi';
import { KeepAlive } from 'react-activation';
import CardLoading from '@/components/CardLoading';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';
import UserDetailList from './components/User/UserDetailList';

const UserTotalInfo = lazy(() => import('./components/User/UserTotalInfo'));

const AccountUserList = (props) => {
  const { userlist, loading, dispatch } = props;

  const match = useLocation();
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
      title: '操作',
      dataIndex: 'id',
      fixed: 'right',
      align: 'right',
      render: (val, record) => (
        <HandleSetTable
          formItems={[
            {
              type: 'own',
              title: '卡豆明细',
              click: () => setVisible({ type: 'peas', record }),
            },
            {
              type: 'own',
              title: '充值记录',
              click: () => setVisible({ type: 'recharge', record }),
            },
          ]}
        />
      ),
    },
  ];

  useEffect(() => {
    dispatch({
      type: 'accountUser/clearDetail',
    });
  }, [visible]);

  return (
    <KeepAlive name="用户账户" url={match.pathname} saveScrollPosition="screen">
      <>
        <Suspense fallback={<CardLoading></CardLoading>}>
          <UserTotalInfo></UserTotalInfo>
        </Suspense>
        <DataTableBlock
          loading={loading}
          columns={getColumns}
          searchItems={searchItems}
          rowKey={(record) => `${record.userIdString}`}
          dispatchType="accountUser/fetchGetList"
          {...userlist}
        ></DataTableBlock>
        <UserDetailList visible={visible} setVisible={setVisible}></UserDetailList>
      </>
    </KeepAlive>
  );
};

export default connect(({ accountUser, loading }) => ({
  userlist: accountUser.userlist,
  loading: loading.effects['accountUser/fetchGetList'],
}))(AccountUserList);
