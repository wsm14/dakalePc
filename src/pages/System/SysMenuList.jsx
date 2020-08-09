import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';

const SysMenuList = (props) => {
  const { sysMenuList, loading, dispatch } = props;

  const childRef = useRef();

  // 搜索参数
  const searchItems = [
    {
      label: '姓名',
      name: 'userMobile1',
    },
    {
      label: '账号',
      name: 'userMob2ile1',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '菜单名称',
      dataIndex: 'userId',
    },
    {
      title: '菜单状态',
      align: 'center',
      dataIndex: 'phoneNumber',
    },
    {
      title: '菜单路径',
      align: 'left',
      dataIndex: 'orderCount',
    },
    {
      title: '操作',
      dataIndex: 'id',
      align: 'center',
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

  return (
    <>
      <DataTableBlock
        title="后台菜单"
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.userId}`}
        dispatchType="sysMenuList/fetchGetList"
        params={{ type: 1 }}
        {...sysMenuList}
      ></DataTableBlock>
      <DataTableBlock
        title="商家菜单"
        style={{ marginTop: 20 }}
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.userId}`}
        dispatchType="sysMenuList/fetchGetList"
        {...sysMenuList}
      ></DataTableBlock>
    </>
  );
};

export default connect(({ sysMenuList, loading }) => ({
  sysMenuList,
  loading: loading.models.sysMenuList,
}))(SysMenuList);
