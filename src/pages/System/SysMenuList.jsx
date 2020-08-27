import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Button, Badge, Card } from 'antd';
import { MENU_STATUS } from '@/common/constant';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';

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
  const { sysMenuList, loading } = props;

  const childRef = useRef();
  const [tabkey, setTabKey] = useState('admin');

  // table 表头
  const getColumns = [
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
              //   click: () => setShowCoach(record),
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

  useEffect(() => {
    childRef.current.fetchGetData();
  }, [tabkey]);

  return (
    <Card
      tabBarExtraContent={<Button className="dkl_green_btn">新增</Button>}
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
        pParams={{ limit: 10 }}
        {...sysMenuList.list}
      ></DataTableBlock>
    </Card>
  );
};

export default connect(({ sysMenuList, loading }) => ({
  sysMenuList,
  loading: loading.effects['sysMenuList/fetchGetList'],
}))(SysMenuList);
