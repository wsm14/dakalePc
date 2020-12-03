import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import { Switch, Button, Menu } from 'antd';
import { WORKER_JOB_TYPE } from '@/common/constant';
import Ellipsis from '@/components/Ellipsis';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';
import UserSetForm from '../Form/UserSetForm';
import CITYJSON from '@/common/city';

const { SubMenu } = Menu;

const UserList = (props) => {
  const { loading, dispatch, workerManageUser } = props;

  const childRef = useRef();
  const [visible, setVisible] = useState(false);
  // 获取用户详情
  const fetchDetail = (payload) => {
    dispatch({
      type: 'workerManageUser/fetchUserDetailsByPartner',
      payload,
      callback: (userInfo) => setVisible({ visible: true, userInfo }),
    });
  };

  // 用户修改
  const fetchEdit = (payload) => {
    dispatch({
      type: 'workerManageUser/fetchUserEditByPartner',
      payload,
      callback: () => childRef.current.fetchGetData(),
    });
  };

  // 搜索参数
  const searchItems = [
    {
      label: '代理区县',
      type: 'cascader',
      name: 'city',
      changeOnSelect: true,
      valuesKey: ['provinceCode', 'cityCode', 'districtCode'],
    },
    {
      label: '代理公司名称',
      name: 'companyName',
    },
    {
      label: '联系人',
      name: 'personName',
    },
    {
      label: '登录账号',
      name: 'account',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '代理区县',
      dataIndex: 'districtName',
    },
    {
      title: '代理公司名称',
      align: 'center',
      dataIndex: 'companyName',
    },
    {
      title: '登录账号',
      align: 'center',
      dataIndex: 'account',
    },
    {
      title: '联系人姓名',
      dataIndex: 'personName',
    },
    {
      title: '联系人岗位',
      dataIndex: 'post',
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
    },
    {
      title: '性别',
      dataIndex: 'gender',
      render: (val) => ({ M: '男', F: '女', '': '--' }[val]),
    },

    {
      title: '角色',
      dataIndex: 'roleNames',
      render: (val) => (
        <Ellipsis length={10} tooltip>
          {val || '--'}
        </Ellipsis>
      ),
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
    // {
    //   title: '在职状态',
    //   align: 'center',
    //   dataIndex: 'sellStatus',
    //   render: (val) => WORKER_JOB_TYPE[val],
    // },
    {
      title: '启用状态',
      align: 'center',
      fixed: 'right',
      dataIndex: 'status',
      render: (val, record) => (
        <Switch
          checkedChildren="启"
          unCheckedChildren="停"
          checked={val === '1'}
          onClick={() => fetchEdit({ authPartnerId: record.authPartnerId, status: 1 ^ val })}
        />
      ),
    },
    {
      title: '操作',
      align: 'right',
      fixed: 'right',
      dataIndex: 'authPartnerId',
      render: (authPartnerId) => (
        <HandleSetTable
          formItems={[
            {
              type: 'edit',
              click: () => fetchDetail({ authPartnerId }),
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
            新增用户
          </Button>
        }
        CardNone={false}
        cRef={childRef}
        loading={loading}
        searchItems={searchItems}
        columns={getColumns}
        rowKey={(record) => `${record.authPartnerId}`}
        dispatchType="workerManageUser/fetchUserListByPartner"
        {...workerManageUser['partnerList']}
      ></DataTableBlock>
      <UserSetForm childRef={childRef} {...visible} onClose={() => setVisible(false)}></UserSetForm>
    </>
  );
};

export default connect(({ workerManageUser, workerManageSection, loading }) => ({
  workerManageUser,
  menuList: workerManageSection.list,
  loading:
    loading.effects['workerManageUser/fetchUserListByPartner'] ||
    loading.effects['workerManageUser/fetchUserDetailsByPartner'],
}))(UserList);
