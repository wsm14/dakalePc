import React, { useState, useRef } from 'react';
import { Button, Card } from 'antd';
import { connect } from 'umi';
import HandleSetTable from '@/components/HandleSetTable';
import TableDataBlock from '@/components/TableDataBlock';

const tabList = [
  {
    key: 'tab1',
    tab: 'Native跳转配置',
  },
  {
    key: 'tab2',
    tab: 'Native跳转配置2',
  },
];

const SysAccountSet = (props) => {
  const { sysAccountList, loading, dispatch } = props;

  const [tabkey, setTabKey] = useState('tab1');

  const childRef = useRef();

  // table 表头
  const getColumns = [
    {
      title: '名称',
      dataIndex: 'truename',
    },
    {
      title: 'ios',
      align: 'center',
      dataIndex: 'username',
    },
    {
      title: 'android',
      align: 'center',
      dataIndex: 'mobile',
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
              type: 'edit',
              visible: record.username !== 'administrator',
              click: () => fetchGetAccountInfo({ adminId: val }),
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
        <TableDataBlock
          noCard={false}
          cRef={childRef}
          loading={loading}
          columns={getColumns}
          rowKey={(record) => `${record.idString}`}
          dispatchType="sysAccountList/fetchGetList"
          {...sysAccountList}
        ></TableDataBlock>
      </>
    ),
    tab2: (
      <TableDataBlock
        noCard={false}
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        rowKey={(record) => `${record.idString}`}
        dispatchType="sysAccountList/fetchGetList"
        {...sysAccountList}
      ></TableDataBlock>
    ),
  };

  return (
    <Card
      tabBarExtraContent={
        <Button className="dkl_green_btn" onClick={() => handleSysMenuSet()}>
          新增
        </Button>
      }
      tabList={tabList}
      activeTabKey={tabkey}
      onTabChange={(key) => setTabKey(key)}
    >
      {contentList[tabkey]}
    </Card>
  );
};

export default connect(({ sysAccountList, loading }) => ({
  sysAccountList,
  loading: loading.models.sysAccountList,
}))(SysAccountSet);
