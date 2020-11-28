import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import { Switch, Button } from 'antd';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';
import RoleSetForm from '../Form/RoleSetForm';

const RoleList = (props) => {
  const { loading, dispatch, roleSetting } = props;

  const childRef = useRef();
  const [visible, setVisible] = useState(false);

  // 搜索参数
  const searchItems = [
    {
      label: '角色名称',
      name: 'roleName',
    },
  ];

  /**
   * 获取用户权级
   * 
   * flag 为 1 的情况下获取本地菜单全部按钮
   * 若payload存在则为 修改 调用fetchDetail获取 角色当前详情
   * 若payload不存在 为新增 直接打开角色 新增修改表单
   * flag 为 0 的情况下 
   * 先调用 fetchGetUserMenu 获取用户可配置菜单数据
   * 若payload存在则为 修改 后调用fetchDetail获取 用户当前角色详情返现
   * 若payload不存在 为新增 直接打开新增修改表单 用fetchGetUserMenu 获取的数据渲染可选择的表格内容
   */
  const fetchFlag = (payload) => {
    dispatch({
      type: 'roleSetting/fetchAllGetRoleFlag',
      payload: {
        ownerType: 'admin',
      },
      callback: (flag) =>
        ({
          1: payload ? fetchDetail() : setVisible({ visible: true, userInfo }),
          0: fetchGetUserMenu(payload, () => setVisible({ visible: true, userInfo })),
        }[flag]),
    });
  };

  // 获取角色详情
  const fetchDetail = (payload) => {
    dispatch({
      type: 'roleSetting/fetchAllGetRoleDetail',
      payload,
      callback: (userInfo) => setVisible({ visible: true, userInfo }),
    });
  };

  // 用户可配置菜单
  const fetchGetUserMenu = (payload, callback) => {
    dispatch({
      type: 'roleSetting/fetchAllUserRoleDetail',
      callback: callback ? callback : () => fetchDetail(payload),
    });
  };

  // 角色修改
  const fetchEdit = (payload) => {
    dispatch({
      type: 'roleSetting/fetchAllRoleEdit',
      payload,
      callback: () => childRef.current.fetchGetData(),
    });
  };

  // table 表头
  const getColumns = [
    {
      title: '角色名称',
      dataIndex: 'roleName',
      width: 200,
    },
    {
      title: '备注',
      align: 'center',
      dataIndex: 'remark',
    },
    {
      title: '启用状态',
      align: 'center',
      fixed: 'right',
      width: 100,
      dataIndex: 'status',
      render: (val, record) => (
        <Switch
          checkedChildren="启"
          unCheckedChildren="停"
          checked={val === '1'}
          onClick={() => fetchEdit({ roleId: record.idString, status: 1 ^ val })}
        />
      ),
    },
    {
      title: '操作',
      width: 200,
      align: 'right',
      fixed: 'right',
      dataIndex: 'idString',
      render: (val, record) => (
        <HandleSetTable
          formItems={[
            {
              type: 'own',
              title: '权限设置',
              click: () => fetchGetUserMenu({ roleId: val }),
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
          <Button className="dkl_green_btn" key="1" onClick={fetchFlag}>
            新增
          </Button>
        }
        CardNone={false}
        cRef={childRef}
        loading={loading}
        searchItems={searchItems}
        columns={getColumns}
        params={{ ownerType: 'admin', clusterId: '0' }}
        rowKey={(record) => `${record.idString}`}
        dispatchType="roleSetting/fetchGetList"
        {...roleSetting}
      ></DataTableBlock>
      <RoleSetForm childRef={childRef} {...visible} onClose={() => setVisible(false)}></RoleSetForm>
    </>
  );
};

export default connect(({ roleSetting, loading }) => ({
  roleSetting,
  loading: loading.models.roleSetting,
}))(RoleList);
