import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import { Switch, Button, Menu } from 'antd';
import { WORKER_JOB_TYPE } from '@/common/constant';
import AuthConsumer from '@/layouts/AuthConsumer';
import HandleSetTable from '@/components/TableDataBlock/HandleSetTable';
import TableDataBlock from '@/components/TableDataBlock';
import UserSetForm from '../Form/UserSetForm';

const { SubMenu } = Menu;

const UserList = (props) => {
  const { loading, dispatch, accountList, menuList } = props;

  const childRef = useRef();
  const [visible, setVisible] = useState(false);
  const [departmentIds, setDepartmentIds] = useState('');

  // 获取用户详情
  const fetchDetail = (payload) => {
    dispatch({
      type: 'accountList/fetchOwnAccountDetail',
      payload,
      callback: (userInfo) => setVisible({ visible: true, userInfo }),
    });
  };

  // 用户修改
  const fetchEdit = (payload) => {
    dispatch({
      type: 'accountList/fetchOwnAccountEdit',
      payload,
      callback: () => childRef.current.fetchGetData(),
    });
  };

  // 搜索参数
  const searchItems = [
    {
      label: '用户姓名',
      name: 'adminName',
    },
    {
      label: '手机号',
      name: 'mobile',
    },
    {
      label: '在职状态',
      name: 'workStatus',
      type: 'select',
      select: WORKER_JOB_TYPE,
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '用户姓名',
      dataIndex: 'adminName',
    },
    {
      title: '性别',
      align: 'center',
      dataIndex: 'gender',
      render: (val) => ({ M: '男', F: '女', '': '--' }[val]),
    },
    {
      title: '手机号',
      align: 'center',
      dataIndex: 'mobile',
    },
    {
      title: '部门',
      dataIndex: 'departmentName',
    },
    {
      title: '角色',
      dataIndex: 'roleNames',
      ellipsis: true,
    },
    {
      title: '入职日期',
      align: 'center',
      dataIndex: 'entryDate',
      render: (val) => val || '--',
    },
    {
      title: '邮箱',
      align: 'center',
      dataIndex: 'email',
      render: (val) => val || '--',
    },
    {
      title: '在职状态',
      align: 'center',
      dataIndex: 'workStatus',
      render: (val) => WORKER_JOB_TYPE[val],
    },
    {
      title: '启用状态',
      align: 'center',
      fixed: 'right',
      dataIndex: 'status',
      render: (val, record) => (
        <AuthConsumer auth="userStatus" noAuth={val === '1' ? '启用' : '停用'}>
          <Switch
            checkedChildren="启"
            unCheckedChildren="停"
            checked={val === '1'}
            onClick={() => fetchEdit({ adminAccountId: record.adminAccountId, status: 1 ^ val })}
          />
        </AuthConsumer>
      ),
    },
    {
      title: '操作',
      align: 'right',
      fixed: 'right',
      dataIndex: 'adminAccountId',
      render: (adminAccountId) => (
        <HandleSetTable
          formItems={[
            {
              type: 'edit',
              auth: 'userEdit',
              click: () => fetchDetail({ adminAccountId }),
            },
          ]}
        />
      ),
    },
  ];

  useEffect(() => {
    fetchSectionList();
  }, []);

  // 获取部门列表
  const fetchSectionList = () => {
    dispatch({
      type: 'sectionSetting/fetchGetList',
      payload: {
        departmentStatus: 1,
        clusterId: '0',
        ownerType: 'admin',
      },
    });
  };
  const routerMenu = (list, val) => {
    return list.map((item, index) => {
      return item[val] ? (
        <SubMenu
          className={item.departmentIdString === departmentIds ? 'ant-menu-item-selected' : ''}
          onTitleClick={({ key }) => {
            let childrenId = '';
            if (item[val]) {
              item[val].map((cid) => (childrenId += `,${cid.departmentIdString}`));
            }
            console.log({ departmentIds: key + childrenId });
            childRef.current.fetchGetData({ departmentIds: key + childrenId });
            setDepartmentIds(key);
          }}
          key={item.departmentIdString}
          title={item.departmentName}
        >
          {routerMenu(item[val], 'children')}
        </SubMenu>
      ) : (
        <Menu.Item key={item.departmentIdString}>{item.departmentName}</Menu.Item>
      );
    });
  };
  const filterOpenKeys = (list, val) => {
    let arr = [];
    const lists = list.filter((item) => {
      if (item[val]) {
        let a = filterOpenKeys(item[val], val);
        arr.push(...a);
        return true;
      }
    });
    return [...lists, ...arr];
  };
  return (
    <div style={{ display: 'flex' }}>
      <Menu
        selectedKeys={[departmentIds || '-1']}
        openKeys={[...filterOpenKeys(menuList, 'children').map((item) => item.departmentIdString)]}
        inlineCollapsed={false}
        defaultSelectedKeys={['-1']}
        onClick={(e) => {
          childRef.current.fetchGetData(
            e.key == '-1' ? { departmentIds: '' } : { departmentIds: e.key },
          );
          setDepartmentIds(e.key == '-1' ? '' : e.key);
        }}
        mode="inline"
        style={{
          width: 200,
          marginRight: 24,
          overflowY: 'auto',
          overflowX: 'hidden',
          maxHeight: 770,
        }}
      >
        <Menu.Item key="-1">所有部门</Menu.Item>
        {menuList && routerMenu(menuList, 'children')}
      </Menu>
      <div style={{ flex: 1 }}>
        <TableDataBlock
          btnExtra={
            <AuthConsumer auth="userAdd">
              <Button
                className="dkl_green_btn"
                key="1"
                onClick={() => setVisible({ visible: true })}
              >
                新增用户
              </Button>
            </AuthConsumer>
          }
          noCard={false}
          cRef={childRef}
          loading={loading}
          searchItems={searchItems}
          columns={getColumns}
          params={{ departmentIds }}
          rowKey={(record) => `${record.adminAccountId}`}
          dispatchType="accountList/fetchGetList"
          {...accountList}
        ></TableDataBlock>
        <UserSetForm
          childRef={childRef}
          {...visible}
          onClose={() => setVisible(false)}
        ></UserSetForm>
      </div>
    </div>
  );
};

export default connect(({ accountList, sectionSetting, loading }) => ({
  accountList,
  menuList: sectionSetting.list,
  loading: loading.models.accountList || loading.effects['sectionSetting/fetchGetList'],
}))(UserList);
