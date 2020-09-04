import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';
import tradeCategorySet from './components/Trade/TradeCategorySet';
import TradeDetailList from './components/Trade/TradeDetailList';
import TradePlatformDetailList from './components/Trade/TradePlatformDetailList';

const SysTradeSet = (props) => {
  const { list, loading, dispatch } = props;

  const childRef = useRef();
  const [visible, setVisible] = useState('');
  const [pvisible, setPVisible] = useState('');

  // 搜索参数
  const searchItems = [
    {
      label: '行业名称',
      name: 'categoryName',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '行业类目',
      fixed: 'left',
      align: 'center',
      dataIndex: 'categoryName',
    },
    {
      title: '平台服务费',
      align: 'center',
      dataIndex: 'parentId',
      render: (val, record) => !val && <a onClick={() => setPVisible({ record })}>设置</a>,
    },
    {
      title: '特色服务',
      align: 'center',
      dataIndex: 'orderCount',
      render: (val, record) =>
        !record.parentId && <a onClick={() => setVisible({ type: 'special', record })}>设置</a>,
    },
    {
      title: '操作',
      dataIndex: 'categoryIdString',
      fixed: 'right',
      align: 'right',
      render: (val, record) => (
        <HandleSetTable
          formItems={[
            {
              type: 'edit',
              click: () =>
                handleTradeCategorySet({ categoryId: val, categoryName: record.categoryName }),
            },
            {
              type: 'del',
              visible: !record.categoryDTOList,
              click: () => fetchTradeDel({ categoryId: val, isDelete: 1 }),
            },
            {
              type: 'own',
              visible: record.parentId === 0,
              title: '添加子类目',
              click: () =>
                handleTradeCategorySet({
                  parentId: val,
                  parentName: record.categoryName,
                  node: `${val}`,
                  type: 'second',
                }),
            },
            // {
            //   type: 'own',
            //   visible: record.parentId !== 0 && !record.categoryDTOList,
            //   title: '添加子类目',
            //   click: () =>
            //     handleTradeCategorySet({
            //       parentId: val,
            //       parentName: record.categoryName,
            //       node: `${val}.${record.parentId}`,
            //       type: 'third',
            //     }),
            // },
          ]}
        />
      ),
    },
  ];

  // 删除类目
  const fetchTradeDel = (values) => {
    dispatch({
      type: 'sysTradeList/fetchTradeSet',
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

  useEffect(() => {
    dispatch({
      type: 'sysTradeList/clearDetail',
    });
  }, [visible, pvisible]);

  return (
    <>
      <DataTableBlock
        cRef={childRef}
        btnExtra={[
          <Button className="dkl_green_btn" key="1" onClick={() => setVisible({ type: 'base' })}>
            基础设施
          </Button>,
          <Button
            className="dkl_green_btn"
            key="2"
            onClick={() => handleTradeCategorySet({ parentId: 0, node: '0', type: 'first' })}
          >
            新增类目
          </Button>,
        ]}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.id}`}
        dispatchType="sysTradeList/fetchGetList"
        {...list}
        expandable={{ childrenColumnName: ['categoryDTOList'] }}
      ></DataTableBlock>
      <TradeDetailList visible={visible} setVisible={setVisible}></TradeDetailList>
      <TradePlatformDetailList
        visible={pvisible}
        setVisible={setPVisible}
      ></TradePlatformDetailList>
    </>
  );
};

export default connect(({ sysTradeList, loading }) => ({
  list: sysTradeList.list,
  loading: loading.effects['sysTradeList/fetchGetList'],
}))(SysTradeSet);
