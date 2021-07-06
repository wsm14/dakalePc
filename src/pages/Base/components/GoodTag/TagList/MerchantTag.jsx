import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import TableDataBlock from '@/components/TableDataBlock';
import TagSet from '../Form/TagSet';
import { DragHandle } from '@/components/TableDataBlock/SortBlock';

const TagManage = (props) => {
  const { goodsTag, loading, dispatch, tabkey } = props;

  const childRef = useRef();
  const [visible, setVisible] = useState(false); // 修改新增框

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
      title: '关联行业',
      align: 'center',
      dataIndex: 'configGoodsTagCategoryList',
      render: (val, record) => val?.map((item) => item.categoryName).join('，'),
    },
    {
      title: '启用状态',
      align: 'center',
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
            type: 'edit',
            click: () =>
              setVisible({
                type: 'edit',
                detail: { ...record, configGoodsTagCategoryList: categoryList, tabkey: tabkey },
              }),
          },
        ];
      },
    },
  ];

  const extraBtn = [
    {
      text: '新增标签',
      auth: 'save',
      onClick: () => setVisible({ type: 'add', tabkey: tabkey }),
    },
  ];

  return (
    <>
      <TableDataBlock
        btnExtra={extraBtn}
        cRef={childRef}
        scroll={{ y: 500 }}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.configGoodsTagId}`}
        dispatchType="goodsTag/fetchGoodsTagList"
        params={{ tagType: tabkey }}
        tableSort={{ key: 'configGoodsTagId', onSortEnd: fetchDetailSort }}
        pagination={false}
        {...goodsTag}
      ></TableDataBlock>
      <TagSet cRef={childRef} visible={visible} onClose={() => setVisible(false)}></TagSet>
    </>
  );
};

export default connect(({ goodsTag, loading }) => ({
  goodsTag,
  loading: loading.models.goodsTag,
}))(TagManage);
