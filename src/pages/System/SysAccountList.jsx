import React, { useState, useRef } from 'react';
import { Button, Card } from 'antd';
import { connect } from 'dva';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';
import SysAccountInfoSet from './components/Account/SysAccountInfoSet';
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
      dataIndex: 'orderCount',
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
      dataIndex: 'id',
      fixed: 'right',
      align: 'right',
      render: (val, record) => (
        <HandleSetTable
          formItems={[
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
      payload: SysAccountInfoSet({ dispatch, childRef, initialValues }),
    });
  };

  const contentList = {
    tab1: (
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
        rowKey={(record) => `${record.id}`}
        dispatchType="sysAccountList/fetchGetList"
        {...sysAccountList}
      ></DataTableBlock>
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
