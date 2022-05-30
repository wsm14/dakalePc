import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import moment from 'moment';
import TableDataBlock from '@/components/TableDataBlock';
import TradeCategoryFrontSet from '../Form/TradeCategoryFrontSet';
import PopImgShow from '@/components/PopImgShow';
import TradeSortSet from '../Form/TradeSortSet';

const CategoryFrontList = (props) => {
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
      title: '类目图片',
      align: 'center',
      dataIndex: 'picUrl',
      render: (val) => {
        return <PopImgShow url={val}></PopImgShow>;
      },
    },
    {
      title: '类目名称',
      align: 'center',
      dataIndex: 'classifyName',
    },
    {
      title: '类目编号',
      align: 'center',
      dataIndex: 'classifyFrontId',
    },
    {
      title: '关联后台类目',
      align: 'center',
      dataIndex: 'classifyDTOList',
      render: (val) => {
        let result = '';
        val &&
          val.forEach((item) => {
            result = `${result}${item.classifyName},`;
          });
        return result.slice(0, -1);
      },
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
          idName="classifyFrontId"
        ></TradeSortSet>
      ),
    },
    {
      title: '状态',
      type: 'switch',
      dataIndex: 'isDelete',
      render: (val, row) => {
        const { classifyFrontId } = row;
        return {
          auth: 'isDelete',
          checkedChildren: '开',
          unCheckedChildren: '关',
          noAuth: val === '0' ? '开' : '关',
          checked: val === '0',
          onClick: () => fetchTradeSet({ classifyFrontId, isDelete: 1 ^ Number(val) }, getList),
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
      dataIndex: 'classifyFrontId',
      render: (val, record) => {
        const { node, parentIdString } = record;
        const listLength = node.split('.').length;
        return [
          {
            type: 'edit',
            click: () => {
              dispatch({
                type: 'Category/fetchFrontCategoryDetail',
                payload: {
                  classifyFrontId: parentIdString,
                },
                callback: (content) => {
                  const { classifyName: parentName } = content;
                  const { isDelete, parentId, ...other } = record;
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
            click: () => fetchTradeSet({ classifyFrontId: val, isDelete: 1 }, getList),
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
                type: 'behind',
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
  const handleClassSet = (status, detail) =>
    setClassVisible({ show: true, status, detail, type: 'behind' });

  //获取列表信息
  const getList = () => {
    childRef.current.fetchGetData();
  };

  // 删除/修改类目
  const fetchTradeSet = (values, callback) => {
    dispatch({
      type: 'Category/fetchFrontCategoryEdit',
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
        rowKey={(record) => `${record.classifyFrontId}`}
        dispatchType="Category/fetchFrontGetList"
        expandable={{
          childrenColumnName: ['childList'],
        }}
        pagination={false}
        {...list}
      ></TableDataBlock>
      {/* 类目新增/修改 */}
      <TradeCategoryFrontSet
        childRef={childRef}
        visible={classVisible}
        onClose={() => setClassVisible(false)}
      ></TradeCategoryFrontSet>
    </>
  );
};

export default connect(({ Category, loading }) => ({
  list: Category.frontList,
  loading: loading.effects['Category/fetchFrontGetList'],
}))(CategoryFrontList);
