import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'umi';
import TableDataBlock from '@/components/TableDataBlock';
import ExtraButton from '@/components/ExtraButton';
import CodeDrawerSet from './components/MaterialConfig/Form/CodeDrawerSet';

const tabList = [
  {
    key: 'user',
    tab: '用户码',
  },
  {
    key: 'merchant',
    tab: '商家码',
  },
];

const MaterialConfig = (props) => {
  const [tabKey, setTabKey] = useState('user');
  const tableRef = useRef();
  const [visibleSet, setVisibleSet] = useState(false);

  const searchItems = [
    {
      label: '配置名称',
      name: 'orderSn',
    },
    {
      label: `${{ user: '跳转内容', merchant: '下载内容' }[tabKey]}`,
      name: 'userId',
    },
  ];

  const getColumns = [
    {
      title: '配置名称',
      dataIndex: 'orderSn',
    },
    {
      title: `${{ user: '跳转内容', merchant: '下载内容' }[tabKey]}`,
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
          click: () => handleUpdateSet('edit'),
        },
        {
          type: 'download',
        },
      ],
    },
  ];

  //  新增/编辑
  const handleUpdateSet = (type) => {
    setVisibleSet({
      show: true,
      tabKey,
      type,
    });
  };

  const tableBtnExtra = ({ get }) => [
    {
      text: '新增',
      auth: 'save',
      onClick: () => handleUpdateSet('add'),
    },
  ];

  const cardBtnList = [
    {
      auth: 'downloadRecord',
      text: '下载记录',
    },
  ];

  return (
    <>
      <TableDataBlock
        cardProps={{
          tabList: tabList,
          activeTabKey: tabKey,
          onTabChange: setTabKey,
          tabBarExtraContent: <ExtraButton list={cardBtnList}></ExtraButton>,
        }}
        cRef={tableRef}
        btnExtra={tableBtnExtra}
        // loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.specialGoodsId}`}
        dispatchType=""
        params={{ promotionLocation: tabKey }}
      ></TableDataBlock>
      {/* 新增/编辑 */}
      <CodeDrawerSet
        visible={visibleSet}
        childRef={tableRef}
        onClose={() => setVisibleSet(false)}
      ></CodeDrawerSet>
    </>
  );
};
export default connect()(MaterialConfig);
