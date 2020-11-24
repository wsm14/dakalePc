import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import { Switch, Button, Menu } from 'antd';
import { WORKER_JOB_TYPE } from '@/common/constant';
import Ellipsis from '@/components/Ellipsis';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';
import UserSetForm from '../Form/UserSetForm';

const { SubMenu } = Menu;

const UserList = (props) => {
  const { loading, dispatch, workerManageUser } = props;

  const childRef = useRef();
  const [visible, setVisible] = useState(false);

  // 获取用户详情
  const fetchDetail = (payload) => {
    dispatch({
      type: 'workerManageUser/fetchWMSUserDetail',
      payload,
      callback: (userInfo) => setVisible({ visible: true, userInfo }),
    });
  };

  // 用户修改
  const fetchEdit = (payload) => {
    dispatch({
      type: 'workerManageUser/fetchWMSUserEdit',
      payload,
      callback: () => childRef.current.fetchGetData(),
    });
  };

  // 搜索参数
  const searchItems = [
    {
      label: '用户姓名',
      name: 'sellName',
    },
    {
      label: '手机号',
      name: 'mobile',
    },
    {
      label: '在职状态',
      name: 'sellStatus',
      type: 'select',
      select: { list: WORKER_JOB_TYPE },
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '用户姓名',
      dataIndex: 'sellName',
    },
    {
      title: '性别',
      align: 'center',
      dataIndex: 'gender',
      render: (val) => ({ M: '男', F: '女', '': '--' }[val]),
    },
    {
      title: '手机号',
      align: 'center',
      dataIndex: 'mobile',
    },
    {
      title: '部门',
      dataIndex: 'departmentName',
    },
    {
      title: '角色',
      dataIndex: 'roleNames',
      render: (val) => (
        <Ellipsis length={10} tooltip>
          {val || '--'}
        </Ellipsis>
      ),
    },
    {
      title: '入职日期',
      align: 'center',
      dataIndex: 'entryDate',
      render: (val) => val || '--',
    },
    {
      title: '邮箱',
      align: 'center',
      dataIndex: 'email',
      render: (val) => val || '--',
    },
    {
      title: '在职状态',
      align: 'center',
      dataIndex: 'sellStatus',
      render: (val) => WORKER_JOB_TYPE[val],
    },
    {
      title: '启用状态',
      align: 'center',
      fixed: 'right',
      dataIndex: 'useStatus',
      render: (val, record) => (
        <Switch
          checkedChildren="启"
          unCheckedChildren="停"
          checked={val === '1'}
          onClick={() => fetchEdit({ sellId: record.sellId, useStatus: 1 ^ val })}
        />
      ),
    },
    {
      title: '操作',
      align: 'right',
      fixed: 'right',
      dataIndex: 'sellId',
      render: (sellId) => (
        <HandleSetTable
          formItems={[
            {
              type: 'edit',
              click: () => fetchDetail({ sellId }),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <>
      <DataTableBlock
        btnExtra={
          <Button className="dkl_green_btn" key="1" onClick={() => setVisible({ visible: true })}>
            新增用户
          </Button>
        }
        CardNone={false}
        cRef={childRef}
        loading={loading}
        searchItems={searchItems}
        columns={getColumns}
        rowKey={(record) => `${record.sellId}`}
        dispatchType="workerManageUser/fetchGetList"
        {...workerManageUser}
      ></DataTableBlock>
      <UserSetForm childRef={childRef} {...visible} onClose={() => setVisible(false)}></UserSetForm>
    </>
  );
};

export default connect(({ workerManageUser, workerManageSection, loading }) => ({
  workerManageUser,
  menuList: workerManageSection.list,
  loading:
    loading.effects['workerManageUser/fetchGetList'] ||
    loading.effects['workerManageUser/fetchWMSUserDetail'],
}))(UserList);
