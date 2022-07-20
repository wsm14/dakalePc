import React from 'react';
import { connect } from 'umi';
import { SHOW_TAG_GOODSTYPE } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';

const ShowTag = (props) => {
  const { goodsTag, loading, dispatch, childRef, setVisible, setVisibleGoods, tabkey } = props;

  // 搜索参数
  const searchItems = [
    {
      label: '标签名称',
      name: 'tagName',
    },
  ];

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
      title: '唯一标识',
      align: 'center',
      dataIndex: 'identification',
    },
    {
      title: '商品类型',
      align: 'center',
      dataIndex: 'goodsType',
      render: (val) => SHOW_TAG_GOODSTYPE[val] || '--',
    },
    {
      title: '启用状态',
      align: 'right',
      type: 'switch',
      dataIndex: 'status',
      render: (val, { configGoodsTagId }) => ({
        auth: 'edit',
        noAuth: val === '1' ? '启用' : '停用',
        checked: val === '1',
        onClick: () => fetchSet({ configGoodsTagId, status: 1 ^ Number(val) }),
      }),
    },
    {
      type: 'handle',
      dataIndex: 'configGoodsTagId',
      render: (val, record) => [
        {
          type: 'connectedGoods',
          click: () => setVisibleGoods({ show: true, id: val, name: record.tagName }),
        },
        {
          type: 'edit',
          click: () => setVisible({ mode: 'edit', detail: { ...record, tagType: tabkey } }),
        },
      ],
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
      pagination={false}
      {...goodsTag}
    ></TableDataBlock>
  );
};

export default connect(({ goodsTag, loading }) => ({
  goodsTag,
  loading: loading.effects['goodsTag/fetchGoodsTagList'],
}))(ShowTag);
