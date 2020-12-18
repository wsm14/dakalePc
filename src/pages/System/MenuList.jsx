import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'umi';
import { Button, Card, Switch } from 'antd';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';
import sysMenuSet from './components/Menu/SysMenuSet';

const tabList = [
  {
    key: 'admin',
    tab: '运营',
  },
  {
    key: 'merchant',
    tab: '商家',
  },
  {
    key: 'group',
    tab: '集团',
  },
  {
    key: 'company',
    tab: '省公司',
  },
  {
    key: 'partner',
    tab: '区县',
  },
  {
    key: 'sell',
    tab: '销售',
  },
];

const SysMenuList = (props) => {
  const { sysMenuList, loading, dispatch } = props;

  const childRef = useRef();
  const [tabkey, setTabKey] = useState('admin');
  const [one, setOne] = useState(false);

  // table 表头
  const getColumns = [
    // {
    //   title: '菜单ID',
    //   dataIndex: 'authAccessId',
    // },
    {
      title: '菜单名称',
      dataIndex: 'accessName',
    },
    {
      title: '菜单状态',
      align: 'center',
      dataIndex: 'status',
      render: (val, record) => (
        <Switch
          checkedChildren="启"
          unCheckedChildren="停"
          checked={val === '1'}
          onClick={() => fetchGetMenuDetail({ accessId: record.authAccessId }, val)}
        />
      ),
    },
    // {
    //   title: '菜单路径',
    //   align: 'center',
    //   dataIndex: 'orderCount',
    // },
    {
      title: '操作',
      dataIndex: 'authAccessId',
      align: 'right',
      render: (val, record) => (
        <HandleSetTable
          formItems={[
            {
              type: 'edit',
              click: () => fetchGetMenuDetail({ accessId: val }),
            },
            {
              type: 'own',
              title: '添加',
              click: () =>
                handleSysMenuSet({
                  menuName: record.accessName,
                  pid: val,
                  authType: '2',
                  status: '1',
                  ownerType: tabkey,
                  type: 'addChildren',
                }),
            },
          ]}
        />
      ),
    },
  ];

  // 获取菜单信息
  const fetchGetMenuDetail = (payload, val = undefined) => {
    dispatch({
      type: 'sysMenuList/fetchGetMenuDetail',
      payload,
      callback: val === undefined ? handleSysMenuSet : fetchSetMenuStatus,
    });
  };

  // 修改角色状态
  const fetchSetMenuStatus = (payload) => {
    dispatch({
      type: 'sysMenuList/fetchMenuSet',
      payload: {
        ...payload,
        pid: payload.pidString,
        id: payload.accessId,
        status: Number(!Number(payload.status)),
      },
      callback: handleCallback,
    });
  };

  // 获取权限树
  const fetchGetAuthMenuTree = () => {
    dispatch({
      type: 'userInfo/fetchGetAuthMenuTree',
    });
  };

  const handleCallback = () => {
    childRef.current.fetchGetData();
    if (tabkey === 'admin') fetchGetAuthMenuTree();
  };

  // 新增/修改
  const handleSysMenuSet = (initialValues = { authType: '2', status: '1', ownerType: tabkey }) => {
    dispatch({
      type: 'drawerForm/show',
      payload: sysMenuSet({
        dispatch,
        allMenu: sysMenuList.allMenu,
        initialValues: { pid: initialValues.pidString, ...initialValues },
        handleCallback,
      }),
    });
  };

  useEffect(() => {
    if (one) {
      childRef.current.fetchGetData();
    }
  }, [tabkey]);

  return (
    <Card
      tabBarExtraContent={
        <Button className="dkl_green_btn" onClick={() => handleSysMenuSet()}>
          新增
        </Button>
      }
      tabList={tabList}
      activeTabKey={tabkey}
      onTabChange={(key) => {
        setTabKey(key);
        setOne(true);
      }}
    >
      <DataTableBlock
        CardNone={false}
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        rowKey={(record) => `${record.authAccessId}`}
        dispatchType="sysMenuList/fetchGetList"
        params={{ ownerType: tabkey }}
        pParams={{ limit: 101 }}
        {...sysMenuList}
      ></DataTableBlock>
    </Card>
  );
};

export default connect(({ sysMenuList, loading }) => ({
  sysMenuList,
  loading: loading.models.sysMenuList,
}))(SysMenuList);
