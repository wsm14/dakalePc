import React, { useRef, useState } from 'react';
import TableDataBlock from '@/components/TableDataBlock';
import { connect } from 'umi';

const UserCode = (props) => {
  const { tabKey } = props;
  const childRef = useRef();

  const searchItems = [
    {
      label: '配置名称',
      name: 'orderSn',
    },
    {
      label: '跳转内容',
      name: 'userId',
    },
  ];

  const getColumns = [
    {
      title: '配置名称',
      dataIndex: 'orderSn',
    },
    {
      title: '跳转内容',
      dataIndex: 'orderSn',
    },
    {
      title: '创建人',
      dataIndex: 'orderSn',
    },
    {
      title: '创建时间',
      dataIndex: 'orderSn',
    },
    {
      type: 'handle',
      dataIndex: 'orderId',
      render: (val, record, index) => [
        {
          type: 'preview',
          title: '预览',
          // click: () => fetchGoodsDetail(index),
        },
        {
          type: 'edit',
        },
        {
          type: 'download',
          title: '下载',
        },
      ],
    },
  ];
  const btnList = ({ get }) => [
    {
      text: '新增',
      auth: 'save',
      // onClick: handleSetActive,
    },
  ];
  return (
    <>
      <TableDataBlock
        btnExtra={btnList}
        cRef={childRef}
        // loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.specialGoodsId}`}
        dispatchType=""
        params={{ type: tabKey }}
      ></TableDataBlock>
    </>
  );
};
export default connect()(UserCode);
