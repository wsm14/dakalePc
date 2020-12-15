import React, { useRef } from 'react';
import { connect } from 'dva';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';
import { ACCOUNT_STATUS, REAL_NAME_STATUS } from '@/common/constant';
import userDetailShow from './components/UserDetailShow';
import UserListTotalInfo from './components/UserList/UserTotalInfo';
import UserTotalSpread from './components/UserList/UserTotalSpread';

const UserListComponent = (props) => {
  const { list, loading, dispatch } = props;

  const childRef = useRef();

  // 搜索参数
  const searchItems = [
    {
      label: '注册手机号',
      name: 'mobile',
    },
    {
      label: '用户昵称',
      name: 'username',
    },
    {
      label: '注册时间',
      type: 'rangePicker',
      name: 'createTimeStart',
      end: 'createTimeEnd',
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
      dataIndex: 'mobile',
      render: (val) => val || '暂未授权',
    },
    {
      title: '昵称',
      dataIndex: 'username',
    },
    {
      title: '性别',
      align: 'center',
      dataIndex: 'gender',
      render: (val) => ({ M: '男', F: '女', '': '--' }[val]),
    },
    {
      title: '实名认证',
      align: 'center',
      dataIndex: 'realNameStatus',
      render: (val) => REAL_NAME_STATUS[val],
    },
    {
      title: '常驻地',
      align: 'center',
      dataIndex: 'residentAddress',
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
      align: 'right',
      fixed: 'right',
      dataIndex: 'parentUserIdString',
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
      payload: userDetailShow({ dispatch, childRef, initialValues }),
    });
  };

  return (
    <DataTableBlock
      keepName="用户数据"
      cRef={childRef}
      loading={loading}
      columns={getColumns}
      searchItems={searchItems}
      rowKey={(record) => `${record.userIdString}`}
      dispatchType="userList/fetchGetList"
      {...list}
    >
      <UserListTotalInfo></UserListTotalInfo>
      <UserTotalSpread></UserTotalSpread>
    </DataTableBlock>
  );
};

export default connect(({ userList, loading }) => ({
  list: userList.list,
  loading: loading.effects['userList/fetchGetList'],
}))(UserListComponent);
