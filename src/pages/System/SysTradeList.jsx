import React, { useRef } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';
import tradeCategorySet from './components/Trade/TradeCategorySet';

const SysTradeSet = (props) => {
  const { sysTradeList, loading, dispatch } = props;

  const childRef = useRef();

  // 搜索参数
  const searchItems = [
    {
      label: '行业名称',
      name: 'userMobile1',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '行业类目',
      align: 'center',
      dataIndex: 'userId',
    },
    {
      title: '平台服务费',
      align: 'center',
      dataIndex: 'phoneNumber',
      render: (val, record) => !record.pid && <a>设置</a>,
    },
    {
      title: '特色服务',
      align: 'center',
      dataIndex: 'orderCount',
      render: (val, record) => !record.pid && <a>设置</a>,
    },
    {
      title: '操作',
      dataIndex: 'id',
      align: 'right',
      render: (val, record) => (
        <HandleSetTable
          formItems={[
            {
              type: 'edit',
              click: () => handleTradeCategoryDetail(record),
            },
            {
              type: 'del',
              click: () => fetchTradeDel(record),
            },
            {
              type: 'own',
              visible: !!record.children,
              title: '添加子类目',
              //   click: () => setShowCoach(record),
            },
          ]}
        />
      ),
    },
  ];

  // 获取详情
  const handleTradeCategoryDetail = (values) => {
    dispatch({
      type: 'sysTradeList/fetchTradeDetail',
      payload: values,
      callback: (val) => handleTradeCategorySet(val),
    });
  };

  // 删除类目
  const fetchTradeDel = (values) => {
    dispatch({
      type: 'sysTradeList/fetchTradeDel',
      payload: values,
      callback: () => childRef.current.fetchGetData(),
    });
  };

  // 新增/修改类目
  const handleTradeCategorySet = (initialValues) => {
    dispatch({
      type: 'drawerForm/show',
      payload: tradeCategorySet({ dispatch, childRef, initialValues }),
    });
  };

  return (
    <DataTableBlock
      cRef={childRef}
      btnExtra={[
        <Button className="dkl_green_btn" key="1">
          基础设施
        </Button>,
        <Button className="dkl_green_btn" key="2" onClick={() => handleTradeCategorySet()}>
          新增类目
        </Button>,
      ]}
      loading={loading}
      columns={getColumns}
      searchItems={searchItems}
      rowKey={(record) => `${record.userId}`}
      dispatchType="sysTradeList/fetchGetList"
      {...sysTradeList}
      list={[
        {
          userId: '餐饮',
          phoneNumber: 1,
          pid: '',
          children: [
            { userId: '美食', pid: '1', children: [{ userId: 12322, pid: '1' }] },
            { userId: '小吃', pid: '1', children: [{ userId: '小吃店', pid: '1' }] },
          ],
        },
        { userId: '娱乐', phoneNumber: 2, children: [{ userId: 11233, pid: '1' }] },
      ]}
    ></DataTableBlock>
  );
};

export default connect(({ sysTradeList, loading }) => ({
  sysTradeList,
  loading: loading.models.sysTradeList,
}))(SysTradeSet);
