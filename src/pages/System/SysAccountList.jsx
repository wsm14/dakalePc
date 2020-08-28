import React, { useState, useRef } from 'react';
import { Button, Card } from 'antd';
import { connect } from 'dva';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';
import sysAccountInfoSet from './components/Account/SysAccountInfoSet';
import SysAccountRoleSet from './components/Account/SysAccountRoleSet';
import SysRoleList from './SysRoleList';

const tabList = [
  {
    key: 'tab1',
    tab: '帐号设置',
  },
  {
    key: 'tab2',
    tab: '角色设置',
  },
];

const SysAccountSet = (props) => {
  const { sysAccountList, loading, dispatch } = props;

  const [tabkey, setTabKey] = useState('tab1');
  const [visible, setVisible] = useState({
    show: false,
    record: {},
  });

  const childRef = useRef();

  // 搜索参数
  const searchItems = [
    {
      label: '姓名',
      name: 'userMobile1',
    },
    {
      label: '账号',
      name: 'userMobile1',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '姓名',
      dataIndex: 'truename',
    },
    {
      title: '账号',
      align: 'center',
      dataIndex: 'username',
    },
    {
      title: '角色',
      align: 'left',
      dataIndex: 'idString',
    },
    {
      title: '手机号',
      align: 'left',
      dataIndex: 'mobile',
      render: (val) => val || '--',
    },
    {
      title: '创建时间',
      align: 'left',
      dataIndex: 'orderTotal',
      render: (val) => val || '--',
    },
    {
      title: '操作',
      dataIndex: 'idString',
      fixed: 'right',
      align: 'right',
      render: (val, record) => (
        <HandleSetTable
          formItems={[
            {
              type: 'own',
              title: '配置角色',
              click: () => fetchAccountRoleTree(val),
            },
            {
              type: 'edit',
              click: () => fetchGetAccountInfo({ adminId: val }),
            },
            {
              type: 'del',
              //   click: () => setShowCoach(record),
            },
          ]}
        />
      ),
    },
  ];

  // 获取管理员权限列表
  const fetchAccountRoleTree = (idString) => {
    dispatch({
      type: 'sysAccountList/fetchAccountRoleTree',
      callback: () => fetchGetAccountRole({ adminId: idString }),
    });
  };

  // id获取管理员角色权限列 打开配置
  const fetchGetAccountRole = (record) => {
    dispatch({
      type: 'sysAccountList/fetchGetAccountRole',
      payload: record,
      callback: (value) =>
        setVisible({ show: true, record: { roleIdList: value, ownerId: record.adminId } }),
    });
  };

  // 获取管理员账户信息
  const fetchGetAccountInfo = (payload) => {
    dispatch({
      type: 'sysAccountList/fetchGetAccountInfo',
      payload,
      callback: handleSysAccountSet,
    });
  };

  // 新增/修改 管理员帐号
  const handleSysAccountSet = (initialValues) => {
    dispatch({
      type: 'drawerForm/show',
      payload: sysAccountInfoSet({ dispatch, childRef, initialValues }),
    });
  };

  const contentList = {
    tab1: (
      <>
        <DataTableBlock
          CardNone={false}
          cRef={childRef}
          loading={loading}
          columns={getColumns}
          searchItems={searchItems}
          btnExtra={
            <Button className="dkl_green_btn" onClick={() => handleSysAccountSet()}>
              新增
            </Button>
          }
          rowKey={(record) => `${record.idString}`}
          dispatchType="sysAccountList/fetchGetList"
          {...sysAccountList}
        ></DataTableBlock>
        <SysAccountRoleSet
          cRef={childRef}
          visible={visible}
          setVisible={() =>
            setVisible({
              show: false,
              record: {},
            })
          }
        ></SysAccountRoleSet>
      </>
    ),
    tab2: <SysRoleList></SysRoleList>,
  };

  return (
    <Card tabList={tabList} activeTabKey={tabkey} onTabChange={(key) => setTabKey(key)}>
      {contentList[tabkey]}
    </Card>
  );
};

export default connect(({ sysAccountList, loading }) => ({
  sysAccountList,
  loading: loading.models.sysAccountList,
}))(SysAccountSet);
