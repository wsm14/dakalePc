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
 * @title 图表标题
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
  const [current, setNum] = useState(pParams.page || 1); // 页码
  const [pageSize, setSize] = useState(
    pParams.limit || { default: 10, middle: 10, small: 10 }[componentSize],
  ); // 每页条数

  // 获取列表
  const fetchGetList = (data) => {
    if (dispatchType)
      dispatch({
        type: dispatchType,
        payload: {
          page: current,
          limit: pageSize,
          ...params,
          ...searchData,
          ...data,
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
    current,
    pageSize,
    showTotal: () => `共${total}项`,
    showQuickJumper: pageSize > 100 ? false : true,
    hideOnSinglePage: total > 0 ? false : true,
    showSizeChanger: pageSize > 100 ? false : true,
    onChange: (page, pagesize) => {
      setNum(page);
      setSize(pagesize);
    },
  };

  // 向父组件暴露方法
  useImperativeHandle(cRef, () => ({
    fetchGetData: (data) => {
      console.log(data);
      dispatch({ type: 'drawerForm/fetchClose', callback: () => fetchGetList(data) });
    },
  }));

  // 保存搜索参数
  const handleSaveParams = () => {
    if (typeof setParams === 'function') setParams({ page: current, limit: pageSize, searchData });
  };

  useEffect(() => {
    if (!first) {
      fetchGetList();
    } else {
      setFirst(false);
    }
    return handleSaveParams;
  }, [current, pageSize, searchData]);

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
