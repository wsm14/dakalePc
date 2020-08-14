import React, { useState, useEffect, useImperativeHandle } from 'react';
import { connect } from 'dva';
import { Table, Card, Space, Button } from 'antd';
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
  CardNone = true,
  extra,
  componentSize = 'default',
}) => {
  const [param] = useState(params);
  const [searchData, setSearchData] = useState({}); // 搜索参数
  const [current, setNum] = useState(1); // 页码
  const [pageSize, setSize] = useState(20); // 每页条数

  // 获取列表
  const fetchGetList = () => {
    dispatch({
      type: dispatchType,
      payload: {
        page: current,
        limit: pageSize,
        ...searchData,
        ...param,
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
    showQuickJumper: true,
    hideOnSinglePage: total > 0 ? false : true,
    showSizeChanger: true,
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

  useEffect(() => {
    fetchGetList();
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
          formItems={searchItems}
          handleSearch={handleSearch}
          btnExtra={btnExtra}
        ></SearchCondition>
      )}
      <Table
        scroll={{ x: 'max-content' }}
        size={componentSize}
        rowKey={rowKey}
        loading={loading}
        dataSource={list}
        columns={columns}
        pagination={paginationProps}
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
