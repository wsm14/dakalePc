import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import { Switch, Button } from 'antd';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';
import RoleSetForm from '../Form/RoleSetForm';

const RoleList = (props) => {
  const { loading, dispatch, workerManageRole } = props;

  const childRef = useRef();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    fetchGetTree();
  }, []);

  // 获取菜单树
  const fetchGetTree = () => {
    dispatch({
      type: 'sysMenuList/fetchGetList',
      payload: { ownerType: 'admin', status: 1 },
    });
  };

  // 搜索参数
  const searchItems = [
    {
      label: '角色名称',
      name: 'roleName',
    },
  ];

  // 获取角色详情
  const fetchDetail = (payload) => {
    dispatch({
      type: 'workerManageRole/fetchWMSRoleDetail',
      payload,
      callback: (userInfo) => setVisible({ visible: true, userInfo }),
    });
  };

  // 角色修改
  const fetchEdit = (payload) => {
    dispatch({
      type: 'workerManageRole/fetchWMSRoleEdit',
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
              click: () => fetchDetail({ roleId: val }),
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
          <Button className="dkl_green_btn" key="1" onClick={() => setVisible({ visible: true })}>
            新增
          </Button>
        }
        CardNone={false}
        cRef={childRef}
        loading={loading}
        searchItems={searchItems}
        columns={getColumns}
        rowKey={(record) => `${record.idString}`}
        dispatchType="workerManageRole/fetchGetList"
        params={{ownerType: 'admin'}}
        {...workerManageRole}
      ></DataTableBlock>
      <RoleSetForm childRef={childRef} {...visible} onClose={() => setVisible(false)}></RoleSetForm>
    </>
  );
};

export default connect(({ workerManageRole, loading }) => ({
  workerManageRole,
  loading:
    loading.effects['workerManageRole/fetchGetList'] ||
    loading.effects['workerManageRole/fetchWMSRoleDetail'] ||
    loading.effects['sysMenuList/fetchGetList'],
}))(RoleList);
