import React, { useState, useEffect, useImperativeHandle } from 'react';
import { useDispatch } from 'umi';
import { Table, Card } from 'antd';
import ExtraButton from '@/components/ExtraButton';
import SearchCondition from '@/components/SearchCondition';
import HandleSetBtn from './HandleSetTable';
import utils from './utils';

// 表格操作按钮
export const HandleSetTable = HandleSetBtn;

/**
 * 搜索+表格信息回显
 * 2020年7月29日 14:48:02 Dong
 * 2021年2月5日 15:57:36 Dong fix
 *
 * @list 表格源数据 必填
 * @columns 表头 必填
 * @rowKey 每行id 必填
 * @dispatchType {*} 表格请求url
 * @total 数据总条数
 * @cRef 父组件获取子组件ref
 * @btnExtra 额外的按钮
 * @searchItems 搜索条件
 * @searchForm 搜索form
 * @searchCallback 搜索回调
 * @resetSearch 重置回调
 * @loading 请求等待
 * @pagination 分页是否显示 赋值false不显示
 * @tableSort 表格排序Object {onSortEnd:()=>{}}
 * @noCard 是否需要Card包裹 默认true
 * @cardProps card 配置聚合Object 原 CardTitle style bodyStyle extra
 * @size 组件大小 small default middle 原componentSize
 * @scrollY 垂直滚动高度
 * @scrollX 横向滚动
 * @firstFetch 原NoSearch 刚打开是否请求 默认true 请求接口
 * @params 搜索时默认参数 移除 pParams params替代全部职能
 * @searchShowData 搜索时默认显示参数 不参与首次搜索
 * @order 排序序号是否显示
 * @tableSize 表格大小 small default middle
 * @children
 **/

const TableBlockComponent = (props) => {
  const {
    btnExtra,
    content,
    cRef,
    cardProps = {},
    dispatchType,
    firstFetch = true,
    columns = [],
    list = [],
    loading,
    noCard = true,
    params = {},
    pagination,
    resetSearch,
    size = 'default',
    scrollY,
    scrollX = 'max-content',
    searchItems,
    searchForm,
    searchCallback,
    searchShowData,
    total,
    sortConfig = null,
    order = false,
    tableSort = false,
    tableSize = 'default',
    timeParams = { time: {}, show: {} },
    children,
    ...other
  } = props;

  const { show } = timeParams;
  const dispatch = useDispatch();

  const [first, setFirst] = useState(firstFetch); // first No search
  const [tableParems, setTableParems] = useState({
    page: 1, // 页码
    limit: 10, // 页数
    sortOrder: '', // 排序字段
    sortField: '', // 排序规则 升降
    searchData: {},
  }); // 表格参数

  // 向父组件暴露方法
  useImperativeHandle(cRef, () => ({
    fetchGetData: (data = {}) => {
      const { page, checkOnly = false } = data;
      if (checkOnly) {
        const { page } = tableParems;
        if (page > 1) setTableParems({ ...tableParems, page: page - 1 });
        return;
      }
      if (page) {
        handleSearch(data);
        return;
      }
      fetchGetList(data);
    },
  }));

  useEffect(() => {
    if (first) {
      fetchGetList();
    } else {
      setFirst(true);
    }
  }, [tableParems]);

  // 获取列表
  const fetchGetList = (data) => {
    if (dispatchType) {
      const { time } = timeParams;
      const payload = {
        ...time,
        ...params,
        ...tableParems.searchData, // 搜索参数
        ...tableParems, // 表格参数
        ...data, // 传递的搜索参数
        limit: pagination === false ? 999 : tableParems.limit, // 每页条数
      };
      delete payload['searchData'];
      dispatch({
        type: dispatchType, // 请求接口
        payload,
      });
    }
  };

  // 搜索
  const handleSearch = (values = {}) => {
    const { time } = timeParams;
    const newSearchValue = { ...time, ...params, ...values };
    setTableParems({
      ...tableParems,
      searchData: newSearchValue,
      limit: params.limit || tableParems.limit,
      page: 1,
    });
    // 搜索回调
    searchCallback && searchCallback(newSearchValue, tableParems);
  };

  // 分页
  const paginationProps = {
    total,
    current: tableParems.page,
    pageSize: tableParems.limit,
    showTotal: () => `共${total || list.length}项`,
    showQuickJumper: true,
    showSizeChanger: true,
  };

  // table change
  const tableChange = (page, filters, sorter = {}) => {
    console.log(page, filters, sorter);
    const { defaultValue = '', sortConstant = {}, sortKey } = sortConfig || {};
    // 是否存在自定义排序规则
    const sortCheck = Object.keys(sorter).length && sortConfig;
    if (
      page.current !== tableParems.page || // 页数变化
      page.pageSize !== tableParems.limit || // 条数变化
      sortCheck // 自定义排序规则存在时排序变化
    ) {
      const sortData = sortCheck
        ? {
            [sortKey]: sorter.order ? sortConstant[sorter.field][sorter.order] : defaultValue,
          }
        : {};
      setTableParems({
        ...tableParems,
        ...sortData,
        page: page.current, // 页码
        limit: page.pageSize, // 每页条数
        // sortOrder: sorter.order, // 排序规则 升降
        // sortField: sorter.field, // 排序字段
      });
    }
  };

  const tabContent = (
    <>
      {!searchItems && btnExtra && (
        <div style={{ textAlign: 'right', marginBottom: 18 }}>
          <ExtraButton list={btnExtra}></ExtraButton>
        </div>
      )}
      {searchItems && (
        <SearchCondition
          form={searchForm}
          resetSearch={resetSearch}
          componentSize={size}
          searchItems={searchItems}
          handleSearch={handleSearch}
          initialValues={{ ...show, ...params, ...searchShowData }}
          btnExtra={btnExtra}
        ></SearchCondition>
      )}
      {content}
      <Table
        scroll={{ x: scrollX, y: scrollY }}
        loading={loading}
        pagination={pagination === false ? false : paginationProps}
        onChange={tableChange}
        size={tableSize || size}
        {...utils.columns(props, tableParems.page)} // 表头数据处理
        {...utils.tableSort(list, tableSort)} // 内置排序处理
        {...other}
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
