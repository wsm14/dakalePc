import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import moment from 'moment';
import TableDataBlock from '@/components/TableDataBlock';
import TradeCategorySet from '../Form/TradeCategorySet';
import TradeSortSet from '../Form/TradeSortSet';

const CategoryBackList = (props) => {
  const { list = {}, loading, dispatch } = props;

  const childRef = useRef();
  const [classVisible, setClassVisible] = useState(false); // 类目设置修改

  // 搜索参数
  const searchItems = [
    {
      label: '类目名称',
      name: 'classifyName',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '类目名称',
      align: 'center',
      dataIndex: 'classifyName',
    },
    {
      title: '类目编号',
      align: 'center',
      dataIndex: 'classifyId',
    },
    {
      title: '权重',
      align: 'center',
      dataIndex: 'sortValue',
      render: (val, row) => (
        <TradeSortSet
          detail={row}
          onSubmit={fetchTradeSet}
          getList={getList}
          idName="classifyId"
        ></TradeSortSet>
      ),
    },
    {
      title: '状态',
      type: 'switch',
      dataIndex: 'isDelete',
      render: (val, row) => {
        const { classifyId } = row;
        return {
          auth: 'isDelete',
          checkedChildren: '开',
          unCheckedChildren: '关',
          noAuth: val === '0' ? '开' : '关',
          checked: val === '0',
          onClick: () => fetchTradeSet({ classifyId, isDelete: 1 ^ Number(val) }, getList),
        };
      },
    },
    {
      title: '最后更新',
      align: 'center',
      dataIndex: 'updateTime',
      render: (val, row) => `${moment(val).format('YYYY-MM-DD HH:mm')}\n${row.updater || ''}`,
    },
    {
      type: 'handle',
      dataIndex: 'classifyId',
      render: (val, record) => {
        const { node, parentIdString } = record;
        const listLength = node.split('.').length;
        return [
          {
            type: 'edit',
            click: () => {
              dispatch({
                type: 'Category/fetchBackCategoryDetail',
                payload: {
                  classifyId: parentIdString,
                },
                callback: (content) => {
                  const { classifyName: parentName } = content;
                  const { isDelete, ...other } = record;
                  const detail = {
                    ...other,
                    isDelete: isDelete === '0' ? true : false,
                    ranking: listLength === 1 ? 'first' : listLength === 2 ? 'second' : 'third',
                    parentName,
                  };
                  handleClassSet('edit', detail);
                },
              });
            },
          },
          {
            type: 'del',
            visible: !record.childList,
            click: () => fetchTradeSet({ classifyId: val, isDelete: 1 }, getList),
          },
          {
            type: 'tradeSecondAdd',
            visible: listLength !== 3,
            click: () => {
              const { classifyName: parentName } = record;
              const ranking = listLength === 2 ? 'third' : 'second';
              const detail = {
                parentId: val,
                parentName,
                ranking,
                isDelete: true,
              };
              handleClassSet('add', detail);
            },
          },
        ];
      },
    },
  ];

  // 类目设置修改
  const handleClassSet = (status, detail) => setClassVisible({ show: true, status, detail });

  //获取列表信息
  const getList = () => {
    childRef.current.fetchGetData();
  };

  // 删除/修改类目
  const fetchTradeSet = (values, callback) => {
    dispatch({
      type: 'Category/fetchBackCategoryEdit',
      payload: values,
      callback,
    });
  };

  const extraBtn = [
    {
      text: '新增类目',
      auth: 'tradeAdd',
      onClick: () => handleClassSet('add', { parentId: 0, ranking: 'first', isDelete: true }),
    },
  ];

  return (
    <>
      <TableDataBlock
        cRef={childRef}
        noCard={false}
        btnExtra={extraBtn}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.classifyId}`}
        dispatchType="Category/fetchGetList"
        expandable={{
          childrenColumnName: ['childList'],
        }}
        pagination={false}
        {...list}
      ></TableDataBlock>
      {/* 类目新增/修改 */}
      <TradeCategorySet
        childRef={childRef}
        visible={classVisible}
        onClose={() => setClassVisible(false)}
      ></TradeCategorySet>
    </>
  );
};

export default connect(({ Category, loading }) => ({
  list: Category.list,
  loading: loading.effects['Category/fetchGetList'],
}))(CategoryBackList);
