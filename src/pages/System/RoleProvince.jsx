import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import { Switch, Button } from 'antd';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';
import RoleSetForm from './components/RoleProvince/Form/RoleSetForm';

const ProvinceRole = (props) => {
  const { loading, dispatch, roleProvinceArea } = props;

  const childRef = useRef();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    fetchGetTree();
  }, []);

  // 获取菜单树
  const fetchGetTree = () => {
    dispatch({
      type: 'sysMenuList/fetchGetList',
      payload: { ownerType: 'company', status: 1 },
    });
  };

  // 获取角色详情
  const fetchDetail = (payload) => {
    dispatch({
      type: 'roleProvinceArea/fetchWMSRoleDetail',
      payload,
      callback: (userInfo) => setVisible({ visible: true, userInfo }),
    });
  };

  // 角色修改
  const fetchEdit = (payload) => {
    dispatch({
      type: 'roleProvinceArea/fetchWMSRoleEdit',
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
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        rowKey={(record) => `${record.idString}`}
        dispatchType="roleProvinceArea/fetchGetList"
        params={{ ownerType: 'company' }}
        {...roleProvinceArea}
      ></DataTableBlock>
      <RoleSetForm childRef={childRef} {...visible} onClose={() => setVisible(false)}></RoleSetForm>
    </>
  );
};

export default connect(({ roleProvinceArea, loading }) => ({
  roleProvinceArea,
  loading:
    loading.effects['roleProvinceArea/fetchGetList'] ||
    loading.effects['roleProvinceArea/fetchWMSRoleDetail'] ||
    loading.effects['sysMenuList/fetchGetList'],
}))(ProvinceRole);
