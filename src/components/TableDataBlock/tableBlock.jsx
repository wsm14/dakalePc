import React, { useState, useEffect, useImperativeHandle } from 'react';
import { useDispatch } from 'umi';
import { Table, Card, Space } from 'antd';
import SearchCondition from '@/components/SearchCondition';
import DraggableContent from './SortBlock';

/**
 *
 * 搜索+表格信息回显
 * 2020年7月29日 14:48:02 Dong
 *
 * @cRef 父组件获取子组件ref
 * @dispatchType {*} 表格请求url
 * @searchItems 搜索条件
 * @searchForm 搜索form
 * @searchCallback 搜索回调
 * @resetSearch 重置回调
 * @rowKey 每行id
 * @columns 表头
 * @loading 请求等待
 * @list 表格源数据
 * @total 数据总条数
 * @btnExtra 额外的按钮
 * @pagination 分页是否显示 赋值false不显示
 * @tableSort 表格排序 {onSortEnd:()=>{}}
 * @noCard 是否需要Card包裹 默认true
 * @cardProps card 配置聚合 原 CardTitle style bodyStyle extra
 * @size 组件大小 原componentSize small default middle
 * @scrollY 垂直滚动高度
 * @scrollX 横向滚动
 * @firstFetch 原NoSearch 刚打开是否请求 默认true 请求接口
 * @children

 * @params 搜索时默认参数 移除 pParams params替代全部职能
 * @setParams 保存分页 搜索数据
 */

const TableBlockComponent = (props) => {
  const {
    // 不修改的参数
    cRef,
    dispatchType,
    searchItems,
    searchForm,
    resetSearch,
    searchCallback,
    btnExtra,
    noCard = true,
    pagination,
    tableSort = false,
    cardProps = {},
    list,
    total,
    children,
    loading,
    scrollY,
    scrollX = 'max-content',
    size = 'default',
    firstFetch = true,
    params = {},
    // end

    setParams,
  } = props;

  const dispatch = useDispatch();

  const [first, setFirst] = useState(firstFetch); // first No search
  const [tableParems, setTableParems] = useState({
    page: 1, // 页码
    limit: { default: 10, middle: 10, small: 10 }[size], // 每页条数
    sortOrder: '', // 排序字段
    sortField: '', // 排序规则 升降
    searchData: params,
  }); // 表格参数

  // 获取列表
  const fetchGetList = (data) => {
    if (dispatchType) {
      const prams = {
        ...tableParems.searchData, // 搜索参数
        ...tableParems, // 表格参数
        ...data, // 传递的搜索参数
      };
      delete prams['searchData'];
      dispatch({
        type: dispatchType, // 请求接口
        payload: prams,
      });
    }
  };

  // 搜索
  const handleSearch = (values = {}) => {
    const newSearchValue = { ...params, ...values };
    setTableParems({
      ...tableParems,
      searchData: newSearchValue,
      page: 1,
    });
    // 搜索回调
    searchCallback && searchCallback(newSearchValue);
  };

  // 分页
  const paginationProps = {
    total,
    current: tableParems.page,
    pageSize: tableParems.limit,
    showTotal: () => `共${total}项`,
    showQuickJumper: tableParems.limit > 100 ? false : true,
    hideOnSinglePage: total > 0 ? false : true,
    showSizeChanger: tableParems.limit > 100 ? false : true,
  };

  // table change
  const tableChange = (page, filters, sorter) => {
    console.log(page, filters, sorter);
    setTableParems({
      ...tableParems,
      page: page.current, // 页码
      limit: page.pageSize, // 每页条数
      // sortOrder: sorter.order, // 排序字段
      // sortField: sorter.field, // 排序规则 升降
    });
  };

  // 向父组件暴露方法
  useImperativeHandle(cRef, () => ({
    fetchGetData: (data = {}) => {
      dispatch({
        type: 'drawerForm/fetchClose',
        callback: () => {
          const { page } = data;
          if (page) {
            handleSearch(data);
            return;
          }
          fetchGetList(data);
        },
      });
    },
  }));

  // 保存搜索参数
  const handleSaveParams = () => {
    if (typeof setParams === 'function') setParams({ ...tableParems });
  };

  useEffect(() => {
    if (first) {
      fetchGetList();
    } else {
      setFirst(false);
    }
    return handleSaveParams;
  }, [tableParems]);

  const tabContent = (
    <>
      {!searchItems && btnExtra && (
        <div style={{ textAlign: 'right', marginBottom: 18 }}>
          <Space>{btnExtra}</Space>
        </div>
      )}
      {searchItems && (
        <SearchCondition
          searchForm={searchForm}
          resetSearch={resetSearch}
          componentSize={size}
          searchItems={searchItems}
          handleSearch={handleSearch}
          initialValues={params}
          btnExtra={btnExtra}
        ></SearchCondition>
      )}
      <Table
        scroll={{ x: scrollX, y: scrollY }}
        loading={loading}
        dataSource={list}
        pagination={pagination === false ? false : paginationProps}
        onChange={tableChange}
        // 排序
        {...(tableSort ? DraggableContent(list, tableSort) : {})}
        {...props}
      />
    </>
  );

  const tableCard = {
    true: (
      <>
        {children}
        {tabContent}
      </>
    ),
    false: (
      <>
        {children}
        <Card {...cardProps}>{tabContent}</Card>
      </>
    ),
  }[!noCard];

  return tableCard;
};

export default TableBlockComponent;
