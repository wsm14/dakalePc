import React, { useState, useEffect, useImperativeHandle } from 'react';
import { connect } from 'umi';
import { Table, Card, Space } from 'antd';
import SearchCondition from '@/components/SearchCondition';
import DraggableContent from './SortBlock';

/**
 *
 * 搜索+表格信息回显
 * 2020年7月29日 14:48:02 Dong
 *
 * @dispatchType {*} 表格请求url
 * @keepName 保持数据的名字
 * @columns 表头
 * @searchItems 搜索条件
 * @searchCallback 搜索回调
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
 * @noCard 是否需要Card包裹 默认true
 * @extra card 右上角
 * @componentSize 组件大小 small default middle
 * @NoSearch 刚打开是否请求 默认false 请求接口
 * @expandable
 * @pagination 分页是否显示 赋值false不显示
 * @scrollY 垂直滚动高度
 * @scrollX 横向滚动
 * @rowSelection
 * @children
 * @tableSort 表格排序 {onSortEnd:()=>{}}
 */

const TableBlockComponent = (props) => {
  const {
    dispatch,
    dispatchType,
    scrollY,
    scrollX = 'max-content',
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
    noCard = true,
    extra,
    componentSize = 'default',
    NoSearch = false,
    expandable,
    pagination,
    rowSelection,
    onRow,
    children,
    tableSort = false,
    searchCallback,
  } = props;

  const [first, setFirst] = useState(NoSearch); // first No search
  const [tableParems, setTableParems] = useState({
    page: pParams.page || 1, // 页码
    limit: pParams.limit || { default: 10, middle: 10, small: 10 }[componentSize], // 每页条数
    sortOrder: '', // 排序字段
    sortField: '', // 排序规则 升降
    searchData: pParams.searchData || {}, // 搜索控件参数
  }); // 表格参数
  // 获取列表
  const fetchGetList = (data) => {
    if (dispatchType) {
      const prams = {
        ...tableParems, // 表格参数
        ...params, // 默认参数
        ...tableParems.searchData, // 搜索参数
        ...data, // 传递的搜索参数
      };

      delete prams.searchData;
      dispatch({
        type: dispatchType, // 请求接口
        payload: prams,
      });
    }
  };

  // 搜索
  const handleSearch = (value) => {
    delete value.page;
    delete value.limit;
    setTableParems({
      ...tableParems,
      page: 1,
      searchData: Object.keys(value).length ? value : {},
    });
    searchCallback && searchCallback(Object.keys(value).length ? value : {});
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
    if (typeof setParams === 'function') setParams({ ...tableParems, searchData: tableParems });
  };

  useEffect(() => {
    if (!first) {
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
          componentSize={componentSize}
          searchItems={searchItems}
          handleSearch={handleSearch}
          initialValues={pParams.searchData}
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
  }[noCard];

  return tableCard;
};

export default connect()(TableBlockComponent);
