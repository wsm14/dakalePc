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
 */

const DataTableBlockComponent = ({
  dispatchType,
  columns,
  searchItems,
  loading,
  dispatch,
  rowKey,
  list,
  total,
  btnExtra,
  style,
  title,
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
}) => {
  const [first, setFirst] = useState(NoSearch); // first No search
  const [searchData, setSearchData] = useState(pParams.searchData || {}); // 搜索参数
  const [current, setNum] = useState(pParams.page || 1); // 页码
  const [pageSize, setSize] = useState(
    pParams.limit || { default: 20, middle: 10, small: 10 }[componentSize],
  ); // 每页条数

  // 获取列表
  const fetchGetList = () => {
    if (dispatchType)
      dispatch({
        type: dispatchType,
        payload: {
          page: current,
          limit: pageSize,
          ...params,
          ...searchData,
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
    fetchGetData: () => {
      dispatch({ type: 'drawerForm/fetchClose', callback: fetchGetList });
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
          componentSize={componentSize}
          searchItems={searchItems}
          handleSearch={handleSearch}
          // initialValues={searchData}
          NoSearch={NoSearch}
          btnExtra={btnExtra}
        ></SearchCondition>
      )}
      <Table
        expandable={expandable}
        scroll={{ x: 'max-content' }}
        size={componentSize}
        rowKey={rowKey}
        loading={loading}
        dataSource={list}
        columns={columns}
        pagination={pagination === false ? false : paginationProps}
      />
    </>
  );

  return {
    true: (
      <Card title={title} style={style} extra={extra}>
        {tabContent}
      </Card>
    ),
    false: tabContent,
  }[CardNone];
};

export default connect()(DataTableBlockComponent);
