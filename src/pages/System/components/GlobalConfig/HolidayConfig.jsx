import React, { useState, useRef } from 'react';
import { connect } from 'umi';
import ExtraButton from '@/components/ExtraButton';
import TableDataBlock from '@/components/TableDataBlock';

const HolidayConfig = (props) => {
  const childRef = useRef();
  const getColumns = [
    {
      title: '节日名称',
      dataIndex: 'name',
    },
    {
      title: '节日名称',
      dataIndex: 'name',
    },
    {
      title: '节日名称',
      dataIndex: 'name',
    },
    {
      title: '节日名称',
      dataIndex: 'name',
    },
    {
      title: '节日名称',
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

  return (
    <TableDataBlock
      cardProps={{ title: '节日配置' }}
      cRef={childRef}
      loading={loading}
      columns={getColumns}
      //   rowKey={(record) => `${record.authAccessId}`}
      dispatchType=""
    ></TableDataBlock>
  );
};

export default connect()(HolidayConfig);
