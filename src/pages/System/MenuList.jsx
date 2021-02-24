import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'umi';
import { Button, Card, Switch } from 'antd';
import HandleSetTable from '@/components/HandleSetTable';
import TableDataBlock from '@/components/TableDataBlock';
import SysMenuSet from './components/Menu/SysMenuSet';

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
  const [visible, setVisible] = useState(false);

  // table 表头
  const getColumns = [
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
    {
      title: '操作',
      dataIndex: 'authAccessId',
      align: 'right',
      render: (val, record) => (
        <HandleSetTable
          formItems={[
            {
              type: 'edit',
              auth: true,
              click: () => fetchGetMenuDetail({ accessId: val }),
            },
            {
              type: 'own',
              title: '添加',
              click: () =>
                handleSysMenuSet("add",{
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
      callback:
        val === undefined
          ? (val) => handleSysMenuSet('edit', val)
          :fetchSetMenuStatus,
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
  const handleSysMenuSet = (
    type,
    val,
    initialValues = { authType: '2', status: '1', ownerType: tabkey },
  ) => {
    if (val && val !== 'undefined') {
      initialValues = { pid: val.pidString, ...initialValues,...val};
    }
    setVisible({
      show: true,
      type,
      initialValues,
      allMenu: sysMenuList.allMenu,
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
        <Button className="dkl_green_btn" onClick={() => handleSysMenuSet('add')}>
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
      <TableDataBlock
        noCard={false}
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        rowKey={(record) => `${record.authAccessId}`}
        dispatchType="sysMenuList/fetchGetList"
        params={{ ownerType: tabkey, limit: 101 }}
        {...sysMenuList}
      ></TableDataBlock>
      <SysMenuSet
        visible={visible}
        onClose={() => setVisible(false)}
        handleCallback={handleCallback}
      ></SysMenuSet>
    </Card>
  );
};

export default connect(({ sysMenuList, loading }) => ({
  sysMenuList,
  loading: loading.models.sysMenuList,
}))(SysMenuList);
