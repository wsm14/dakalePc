import React, { useRef } from 'react';
import { connect } from 'dva';
import { Button, Switch } from 'antd';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';
import sysRoleInfoSet from './components/Role/SysRoleInfoSet';

const SysRoleList = (props) => {
  const { sysRoleList, loading, dispatch } = props;

  const childRef = useRef();

  // table 表头
  const getColumns = [
    {
      title: '角色名称',
      dataIndex: 'roleName',
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
    {
      title: '状态',
      align: 'left',
      dataIndex: 'status',
      render: (val, record) => (
        <Switch
          checkedChildren="启"
          unCheckedChildren="停"
          checked={val === '1'}
          onClick={() => fetchGetRoleInfo({ roleId: record.id })}
        />
      ),
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
              click: () => fetchGetRoleInfo({ roleId: val }, record),
            },
            {
              type: 'own',
              title: '配置',
              //   click: () => setShowCoach(record),
            },
          ]}
        />
      ),
    },
  ];

  // 获取角色信息 传递第二个参数角色信息就是修改 没传递就是修改角色状态
  const fetchGetRoleInfo = (payload, record) => {
    dispatch({
      type: 'sysRoleList/fetchGetRoleInfo',
      payload,
      callback: record ? () => handleSysRoleSet(record) : fetchRoleEdit,
    });
  };

  // 修改角色状态
  const fetchRoleEdit = (payload) => {
    dispatch({
      type: 'sysRoleList/fetchRoleEdit',
      payload: {
        ...payload,
        status: Number(!Number(payload.status)),
      },
      callback: () => childRef.current.fetchGetData(),
    });
  };

  // 新增/修改角色
  const handleSysRoleSet = (initialValues) => {
    dispatch({
      type: 'drawerForm/show',
      payload: sysRoleInfoSet({ dispatch, childRef, initialValues }),
    });
  };

  return (
    <DataTableBlock
      CardNone={false}
      btnExtra={
        <Button className="dkl_green_btn" onClick={() => handleSysRoleSet()}>
          新增
        </Button>
      }
      cRef={childRef}
      loading={loading}
      columns={getColumns}
      rowKey={(record) => `${record.id}`}
      dispatchType="sysRoleList/fetchGetList"
      params={{ type: 1 }}
      {...sysRoleList}
    ></DataTableBlock>
  );
};

export default connect(({ sysRoleList, loading }) => ({
  sysRoleList,
  loading: loading.models.sysRoleList,
}))(SysRoleList);
