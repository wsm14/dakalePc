import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Button, Badge, Card } from 'antd';
import { MENU_STATUS } from '@/common/constant';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';
import sysMenuSet from './components/Menu/SysMenuSet';

const tabList = [
  {
    key: 'admin',
    tab: '后台',
  },
  {
    key: 'merchant',
    tab: '商家',
  },
];

const SysMenuList = (props) => {
  const { sysMenuList, loading, dispatch } = props;

  const childRef = useRef();
  const [tabkey, setTabKey] = useState('admin');

  // table 表头
  const getColumns = [
    {
      title: '菜单ID',
      dataIndex: 'authAccessId',
    },
    {
      title: '菜单名称',
      dataIndex: 'accessName',
    },
    {
      title: '菜单状态',
      align: 'center',
      dataIndex: 'status',
      render: (val) => <Badge status={val === '1' ? 'success' : 'error'} text={MENU_STATUS[val]} />,
    },
    {
      title: '菜单路径',
      align: 'center',
      dataIndex: 'orderCount',
    },
    {
      title: '操作',
      dataIndex: 'authAccessId',
      align: 'right',
      render: (val, record) => (
        <HandleSetTable
          formItems={[
            {
              type: 'edit',
              click: () => fetchGetMenuDetail({ accessId: val }),
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

  // 获取菜单信息
  const fetchGetMenuDetail = (payload) => {
    dispatch({
      type: 'sysMenuList/fetchGetMenuDetail',
      payload,
      callback: handleSysMenuSet,
    });
  };

  // 新增/修改
  const handleSysMenuSet = (initialValues = { authType: '2', status: '1', ownerType: tabkey }) => {
    dispatch({
      type: 'drawerForm/show',
      payload: sysMenuSet({ dispatch, childRef, initialValues }),
    });
  };

  useEffect(() => {
    childRef.current.fetchGetData();
  }, [tabkey]);

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
      <DataTableBlock
        CardNone={false}
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        rowKey={(record) => `${record.authAccessId}`}
        dispatchType="sysMenuList/fetchGetList"
        params={{ roleType: tabkey }}
        {...sysMenuList.list}
      ></DataTableBlock>
    </Card>
  );
};

export default connect(({ sysMenuList, loading }) => ({
  sysMenuList,
  loading: loading.models.sysMenuList,
}))(SysMenuList);
