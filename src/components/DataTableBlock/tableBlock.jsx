import React, { useState, useEffect, useImperativeHandle } from 'react';
import { connect } from 'dva';
import { Table, Card, Space } from 'antd';
import SearchCondition from '@/components/SearchCondition';

/**
 *
 * 搜索+表格信息回显
 * 2020年7月29日 14:48:02 Dong
 *
 * @dispatchType {*} 表格请求url
 * @keepName 保持数据的名字
 * @columns 表头
 * @searchItems 搜索条件
 * @loading 请求等待
 * @list 表格源数据
 * @total 数据总条数
 * @rowKey 每行id
 * @btnExtra 额外的按钮
 * @cRef 父组件获取子组件ref
 * @CardTitle 图表标题
 * @style card style
 * @params 搜索时默认参数
 * @pParams 保存分页 搜索数据保存
 * @setParams 保存分页 搜索数据
 * @CardNone 是否需要Card包裹 默认true
 * @extra card 右上角
 * @componentSize 组件大小 small default middle
 * @NoSearch 刚打开是否请求 默认false 请求接口
 * @expandable
 * @pagination 分页是否显示 赋值false不显示
 * @scrollY 垂直滚动高度
 * @scrollX 横向滚动
 * @rowSelection
 * @children
 */

const TableBlockComponent = (props) => {
  const {
    dispatch,
    dispatchType,
    scrollY,
    scrollX = 'max-content',
    keepName,
    columns,
    searchItems,
    searchForm,
    resetSearch,
    loading,
    rowKey,
    list,
    total,
    btnExtra,
    style,
    bodyStyle,
    CardTitle,
    cRef,
    params,
    pParams = {},
    setParams,
    CardNone = true,
    extra,
    componentSize = 'default',
    NoSearch = false,
    expandable,
    pagination,
    rowSelection,
    onRow,
    children,
  } = props;

  const [first, setFirst] = useState(NoSearch); // first No search
  const [searchData, setSearchData] = useState(pParams.searchData || {}); // 搜索参数
  const [tableParems, setTableParems] = useState({
    page: pParams.page || 1, // 页码
    limit: pParams.limit || { default: 10, middle: 10, small: 10 }[componentSize], // 每页条数
    sortOrder: '', // 排序字段
    sortField: '', // 排序规则 升降
  }); // 表格参数

  // 获取列表
  const fetchGetList = (data) => {
    if (dispatchType)
      dispatch({
        type: dispatchType, // 请求接口
        payload: {
          ...tableParems, // 表格参数
          ...params, // 默认参数
          ...searchData, // 搜索参数
          ...data, // 传递的搜索参数
        },
      });
  };

  // 搜索
  const handleSearch = (value) => {
    setSearchData(value);
    setNum(1);
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
    const { page: tpage, limit } = tableParems;
    if (tpage == page.current && limit == page.pageSize) return false;
    console.log(page, filters, sorter);
    setTableParems({
      page: page.current, // 页码
      limit: page.pageSize, // 每页条数
      // sortOrder: sorter.order, // 排序字段
      // sortField: sorter.field, // 排序规则 升降
    });
  };

  // 向父组件暴露方法
  useImperativeHandle(cRef, () => ({
    fetchGetData: (data) => {
      dispatch({ type: 'drawerForm/fetchClose', callback: () => fetchGetList(data) });
    },
  }));

  // 保存搜索参数
  const handleSaveParams = () => {
    if (typeof setParams === 'function')
      setParams({ page: tableParems.page, limit: tableParems.limit, searchData });
  };

  useEffect(() => {
    if (!first) {
      fetchGetList();
    } else {
      setFirst(false);
    }
    return handleSaveParams;
  }, [tableParems, searchData]);

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
          componentSize={componentSize}
          searchItems={searchItems}
          handleSearch={handleSearch}
          // initialValues={searchData}
          // NoSearch={NoSearch}
          btnExtra={btnExtra}
        ></SearchCondition>
      )}
      <Table
        rowSelection={rowSelection}
        expandable={expandable}
        scroll={{ x: scrollX, y: scrollY }}
        size={componentSize} // 'small' ||
        rowKey={rowKey}
        loading={loading}
        dataSource={list}
        columns={columns}
        pagination={pagination === false ? false : paginationProps}
        onRow={onRow}
        onChange={tableChange}
        {...props}
      />
    </>
  );

  const tableCard = {
    true: (
      <>
        {children}
        <Card title={CardTitle} style={style} extra={extra} bodyStyle={bodyStyle}>
          {tabContent}
        </Card>
      </>
    ),
    false: (
      <>
        {children}
        {tabContent}
      </>
    ),
  }[CardNone];

  return tableCard;
};

export default connect()(TableBlockComponent);
