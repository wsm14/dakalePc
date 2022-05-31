import React from 'react';
import { connect } from 'umi';
import { DragHandle } from '@/components/TableDataBlock/SortBlock';
import TableDataBlock from '@/components/TableDataBlock';

const TagManage = (props) => {
  const { goodsTag, loading, dispatch, childRef, tabkey, setVisible } = props;

  // 搜索参数
  const searchItems = [
    {
      label: '标签名称',
      name: 'tagName',
    },
  ];

  // 排序
  const fetchDetailSort = (list) => {
    dispatch({
      type: 'goodsTag/fetchGoodsTagSort',
      payload: {
        configGoodsTagList: list.map((item, i) => ({
          configGoodsTagId: item.configGoodsTagId,
          sortValue: i,
        })),
      },
      callback: childRef.current.fetchGetData,
    });
  };

  // 启用禁用
  const fetchSet = (payload) => {
    dispatch({
      type: 'goodsTag/fetchGoodsTagSwitchStatus',
      payload,
      callback: childRef.current.fetchGetData,
    });
  };

  // table 表头
  const getColumns = [
    {
      title: '标签名称',
      dataIndex: 'tagName',
      className: 'drag-visible',
      render: (val) => val || '--',
    },
    {
      title: '排序',
      align: 'right',
      dataIndex: 'sort',
      render: () => <DragHandle />,
    },
    {
      title: '启用状态',
      align: 'right',
      type: 'switch',
      dataIndex: 'status',
      render: (val, row) => {
        const { configGoodsTagId } = row;
        return {
          auth: 'edit',
          noAuth: val === '1' ? '启用' : '停用',
          checked: val === '1',
          onClick: () => fetchSet({ configGoodsTagId, status: 1 ^ Number(val) }),
        };
      },
    },
    {
      type: 'handle',
      dataIndex: 'configGoodsTagId',
      render: (val, record) => {
        const { configGoodsTagCategoryList } = record;
        const categoryList =
          configGoodsTagCategoryList &&
          configGoodsTagCategoryList.map((items) => ({
            categoryId: items.categoryIdStr,
          }));
        return [
          {
            type: 'connectedGoods',
            click: () =>
              setVisible({
                mode: 'edit',
                detail: { ...record, tagType: tabkey },
              }),
          },
          {
            type: 'edit',
            click: () =>
              setVisible({
                mode: 'edit',
                detail: { ...record, configGoodsTagCategoryList: categoryList, tagType: tabkey },
              }),
          },
        ];
      },
    },
  ];

  return (
    <TableDataBlock
      noCard={false}
      cRef={childRef}
      loading={loading}
      columns={getColumns}
      scroll={{ y: 500 }}
      searchItems={searchItems}
      params={{ tagType: tabkey }}
      dispatchType="goodsTag/fetchGoodsTagList"
      rowKey={(record) => `${record.configGoodsTagId}`}
      tableSort={{ key: 'configGoodsTagId', onSortEnd: fetchDetailSort }}
      pagination={false}
      {...goodsTag}
    ></TableDataBlock>
  );
};

export default connect(({ goodsTag, loading }) => ({
  goodsTag,
  loading: loading.models.goodsTag,
}))(TagManage);
