import React, { useState, useEffect, useImperativeHandle } from 'react';
import { connect } from 'dva';
import { Table } from 'antd';
import { EditableRow, EditableCell } from './TableEdit';
import styles from './style.less';

const TableEdit = (props) => {
  const {
    loading,
    dispatchType,
    dispatch,
    rowKey,
    columns,
    list,
    componentSize = 'default',
    children,
    handleEdit,
    cRef,
  } = props;

  const [current, setNum] = useState(1); // 页码
  const [pageSize, setSize] = useState({ default: 10, middle: 10, small: 10 }[componentSize]); // 每页条数
  const [searchData, setSearchData] = useState({}); // 搜索参数

  // 向父组件暴露方法
  useImperativeHandle(cRef, () => ({
    fetchGetData: () => {
      dispatch({ type: 'drawerForm/fetchClose', callback: fetchGetList });
    },
  }));

  useEffect(() => {
    fetchGetList();
  }, []);

  // 获取列表
  const fetchGetList = () => {
    if (dispatchType)
      dispatch({
        type: dispatchType,
        payload: {
          page: current,
          limit: pageSize,
          ...searchData,
        },
      });
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const getColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        maxLength: col.maxLength,
        editable: col.editable,
        dataIndex: col.dataIndex,
        required: col.required,
        title: col.title,
        suffix:col.suffix,
        handleSave: (val) => handleEdit(val),
      }),
    };
  });

  return (
    <>
      {children}
      <Table
        expandable={{ defaultExpandAllRows: true }}
        size={componentSize}
        components={components}
        rowClassName={() => styles['editable-row']}
        rowKey={rowKey}
        dataSource={list}
        loading={loading}
        columns={getColumns}
      />
    </>
  );
};

export default connect()(TableEdit);
