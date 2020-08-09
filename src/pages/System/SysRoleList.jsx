import React, { useRef } from 'react';
import { connect } from 'dva';
import { Button, Switch } from 'antd';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';

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
      render: (val) => (
        <Switch
          checkedChildren="启"
          unCheckedChildren="停"
          checked={val === '1'}
          // onClick={() => fetchMenuState(record)}
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
              //   click: () => setShowCoach(record),
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

  return (
    <DataTableBlock
      CardNone={false}
      btnExtra={<Button className="dkl_green_btn">新增</Button>}
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
