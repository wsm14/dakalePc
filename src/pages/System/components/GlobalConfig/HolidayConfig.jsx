import React, { useState, useRef } from 'react';
import { connect } from 'umi';
import ExtraButton from '@/components/ExtraButton';
import TableDataBlock from '@/components/TableDataBlock';
import HolidayConfigSet from './Form/HolidayConfigSet';

const HolidayConfig = (props) => {
  const childRef = useRef();
  const getColumns = [
    {
      title: '节日名称',
      dataIndex: 'name',
    },

    {
      title: '状态',
      dataIndex: 'status',
    },
    {
      title: '展示时间',
      dataIndex: 'time',
    },
    {
      title: '更新人',
      dataIndex: 'name',
    },
    {
      title: '操作',
      dataIndex: 'name',
      render: (val, row) => [
        {
          type: 'down',
          title: '下架',
        },
        {
          type: 'edit',
        },
        {
          type: 'info',
        },
      ],
    },
  ];

  const handleUpdateSet = () => {};

  const cardBtnList = [
    {
      auth: 'save',
      onClick: handleUpdateSet,
    },
  ];

  return (
      <>
    <TableDataBlock
      cardProps={{
        title: '节日配置',
        extra: <ExtraButton list={cardBtnList}></ExtraButton>,
      }}
      cRef={childRef}
      //   loading={loading}
      columns={getColumns}
      //   rowKey={(record) => `${record.authAccessId}`}
      dispatchType=""
    ></TableDataBlock>
    <HolidayConfigSet></HolidayConfigSet>
    </>
  );
};

export default connect()(HolidayConfig);
