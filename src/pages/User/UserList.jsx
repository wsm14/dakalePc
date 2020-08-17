import React, { useRef } from 'react';
import { connect } from 'dva';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';
import { ACCOUNT_STATUS, REAL_NAME_STATUS } from '@/common/constant';
import UserDetailShow from './components/UserDetailShow';
import UserListTotalInfo from './components/UserList/UserTotalInfo';
import UserTotalSpread from './components/UserList/UserTotalSpread';

const UserListComponent = (props) => {
  const { userList, loading, dispatch } = props;

  const childRef = useRef();

  // 搜索参数
  const searchItems = [
    {
      label: '注册手机号',
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
      title: '注册手机号',
      align: 'center',
      dataIndex: 'mobile',
      render: (val) => val || '暂未授权',
    },
    {
      title: '昵称',
      align: 'left',
      dataIndex: 'username',
    },
    {
      title: '性别',
      align: 'left',
      dataIndex: 'gender',
      render: (val) => ({ M: '女', F: '男', '': '--' }[val]),
    },
    {
      title: '实名认证',
      align: 'center',
      dataIndex: 'realNameStatus',
      render: (val) => REAL_NAME_STATUS[val],
    },
    {
      title: '常住地',
      align: 'center',
      dataIndex: 'parentUserIdString',
      render: (val) => val || '-',
    },
    {
      title: '注册时间',
      align: 'center',
      dataIndex: 'createTime',
    },
    {
      title: '账户状态',
      align: 'center',
      dataIndex: 'status',
      render: (val) => ACCOUNT_STATUS[val],
    },
    {
      title: '操作',
      dataIndex: 'id',
      align: 'right',
      fixed: 'right',
      render: (val, record) => (
        <HandleSetTable
          formItems={[
            {
              type: 'info',
              click: () => fetchUserDetail(record.userIdString),
            },
          ]}
        />
      ),
    },
  ];

  // 获取用户详情
  const fetchUserDetail = (userId) => {
    dispatch({
      type: 'userList/fetchUserDetail',
      payload: { userId },
      callback: handleShowUserDetail,
    });
  };

  // 用户详情展示
  const handleShowUserDetail = (initialValues) => {
    dispatch({
      type: 'drawerForm/show',
      payload: UserDetailShow({ dispatch, childRef, initialValues }),
    });
  };

  return (
    <>
      <UserListTotalInfo></UserListTotalInfo>
      <UserTotalSpread></UserTotalSpread>
      <DataTableBlock
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.userIdString}`}
        dispatchType="userList/fetchGetList"
        {...userList}
      ></DataTableBlock>
    </>
  );
};

export default connect(({ userList, loading }) => ({
  userList,
  loading: loading.models.userList,
}))(UserListComponent);
