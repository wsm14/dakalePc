import React, { useRef, useState } from 'react';
import { connect } from 'dva';
import { useLocation } from 'umi';
import { KeepAlive } from 'react-activation';
import { Button, Form, Switch } from 'antd';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';
import sysRoleInfoSet from './components/Role/SysRoleInfoSet';
import SysRoleAllocation from './components/Role/SysRoleAllocation';

const SysRoleList = (props) => {
  const { sysRoleList, loading, dispatch } = props;

  const match = useLocation();
  const [form] = Form.useForm();
  const childRef = useRef();
  const [visible, setVisible] = useState({
    show: false,
    record: {},
  });

  // 搜索参数
  const searchItems = [
    {
      label: '角色名称',
      name: 'roleName',
    },
    {
      label: '角色状态',
      name: 'status',
      type: 'select',
      select: { list: ['停用', '启用'] },
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '角色ID',
      dataIndex: 'idString',
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      render: (val) => val || '--',
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
          onClick={() => fetchGetRoleInfo({ roleId: record.idString })}
        />
      ),
    },
    {
      title: '操作',
      align: 'right',
      dataIndex: 'id',
      render: (val, record) => (
        <HandleSetTable
          formItems={[
            {
              type: 'edit',
              click: () => fetchGetRoleInfo({ roleId: record.idString }, record),
            },
            {
              type: 'own',
              title: '配置',
              click: () =>
                fetchGetRoleTree({ roleId: record.idString, roleType: record.ownerType }),
            },
          ]}
        />
      ),
    },
  ];

  // 获取角色配置信息
  const fetchGetRoleTree = (payload) => {
    dispatch({
      type: 'sysRoleList/fetchGetRoleTree',
      payload,
      callback: (record) =>
        setVisible({ show: true, record: { ...record, roleId: payload.roleId } }),
    });
  };

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
        id: payload.idString,
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
    <>
      <DataTableBlock
        CardNone={false}
        btnExtra={
          <Button className="dkl_green_btn" onClick={() => handleSysRoleSet()}>
            新增
          </Button>
        }
        cRef={childRef}
        loading={loading}
        searchItems={searchItems}
        columns={getColumns}
        rowKey={(record) => `${record.idString}`}
        dispatchType="sysRoleList/fetchGetList"
        params={{ type: 1 }}
        {...sysRoleList}
      ></DataTableBlock>
      <SysRoleAllocation
        cRef={childRef}
        form={form}
        visible={visible}
        setVisible={() =>
          setVisible({
            show: false,
            record: {},
          })
        }
      ></SysRoleAllocation>
    </>
  );
};

export default connect(({ sysRoleList, loading }) => ({
  sysRoleList,
  loading: loading.models.sysRoleList,
}))(SysRoleList);
