import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { Switch } from 'antd';
import AuthConsumer from '@/layouts/AuthConsumer';
import TableDataBlock from '@/components/TableDataBlock';
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
   * 获取当前用户权级
   *
   * flag 为 1 的情况下 拥有全部菜单配置权限
   * 先获取系统全部菜单 （本地菜单映射全部按钮选项）
   * 若 payload 存在则为 修改 调用 fetchDetail 获取 角色当前详情
   * 若 payload 不存在 为新增 直接打开角色 新增修改表单
   * flag 为 0 的情况下 被限制菜单权限
   * 先调用 fetchGetUserMenu 获取用户可配置菜单数据
   * 若 payload 存在则为 修改 后调用 fetchDetail 获取 用户当前角色详情返现
   * 若 payload 不存在 为新增 直接打开新增修改表单 用 fetchGetUserMenu 获取的数据渲染可选择的表格内容
   */
  const fetchFlag = (payload) => {
    dispatch({
      type: 'roleSetting/fetchAllGetRoleFlag',
      payload: {
        ownerType: 'admin',
      },
      callback: (flag) => {
        const callback = () => setVisible({ visible: true, flag });
        flag == 1 ? fetchGetMenuAll(payload, callback) : fetchGetUserMenu(payload, callback, flag);
      },
    });
  };

  // 获取菜单树
  const fetchGetMenuAll = (payload, callback) => {
    dispatch({
      type: 'roleSetting/fetchGetMenuAll',
      payload: { ownerType: 'admin', status: 1 },
      callback: payload ? () => fetchDetail(payload) : callback,
    });
  };

  // 用户可配置菜单
  const fetchGetUserMenu = (payload, callback, flag) => {
    dispatch({
      type: 'roleSetting/fetchAllUserRoleDetail',
      callback: callback && payload ? () => fetchDetail(payload, flag) : callback,
    });
  };

  // 获取角色详情
  const fetchDetail = (payload, flag) => {
    dispatch({
      type: 'roleSetting/fetchAllGetRoleDetail',
      payload,
      callback: (userInfo) => setVisible({ visible: true, userInfo, flag }),
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
        <AuthConsumer auth="roleStatus" noAuth={val === '1' ? '启用' : '停用'}>
          <Switch
            checkedChildren="启"
            unCheckedChildren="停"
            checked={val === '1'}
            onClick={() => fetchEdit({ roleId: record.idString, status: 1 ^ val })}
          />
        </AuthConsumer>
      ),
    },
    {
      type: 'handle',
      width: 200,
      dataIndex: 'idString',
      render: (val) => [
        {
          title: '权限设置',
          auth: 'roleEdit',
          click: () => fetchFlag({ roleId: val }),
        },
      ],
    },
  ];

  const extraBtn = [
    {
      auth: 'roleAdd',
      onClick: () => fetchFlag(),
    },
  ];

  return (
    <>
      <TableDataBlock
        btnExtra={extraBtn}
        noCard={false}
        cRef={childRef}
        loading={loading}
        searchItems={searchItems}
        columns={getColumns}
        params={{ ownerType: 'admin', clusterId: '0' }}
        rowKey={(record) => `${record.idString}`}
        dispatchType="roleSetting/fetchGetList"
        {...roleSetting}
      ></TableDataBlock>
      <RoleSetForm childRef={childRef} {...visible} onClose={() => setVisible(false)}></RoleSetForm>
    </>
  );
};

export default connect(({ roleSetting, loading }) => ({
  roleSetting,
  loading: loading.models.roleSetting,
}))(RoleList);
