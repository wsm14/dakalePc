import React, { useRef, useState } from 'react';
import TableDataBlock from '@/components/TableDataBlock';
import { connect } from 'umi';
const MerchantCode = (props) => {
  const { tabKey } = props;
  const childRef = useRef();

  const searchItems = [
    {
      label: '配置名称',
      name: 'orderSn',
    },
    {
      label: '下载内容',
      name: 'userId',
    },
  ];

  const getColumns = [
    {
      title: '配置名称',
      dataIndex: 'orderSn',
    },
    {
      title: '下载内容',
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
    <TableDataBlock
      cRef={childRef}
      btnExtra={btnList}
      // loading={loading}
      columns={getColumns}
      searchItems={searchItems}
      rowKey={(record) => `${record.specialGoodsId}`}
      dispatchType=""
      params={{ type: tabKey }}
    ></TableDataBlock>
  );
};
export default connect()(MerchantCode);
