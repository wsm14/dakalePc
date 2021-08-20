import React, { useState, useRef } from 'react';
import { connect } from 'umi';
import ExtraButton from '@/components/ExtraButton';
import TableDataBlock from '@/components/TableDataBlock';
import HolidayConfigSet from './Form/HolidayConfigSet';

const HolidayConfig = (props) => {
  const [visible, setVisible] = useState(false);

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
          click: (val, row) => handleUpdateSet('edit', val),
        },
        {
          type: 'info',
          click: (val, row) => handleUpdateSet('info', val),
        },
      ],
    },
  ];

  const handleUpdateSet = (type, val) => {
    setVisible({
      show: true,
      type,
    });
  };

  const cardBtnList = [
    {
      auth: 'save',
      onClick: () => handleUpdateSet('save'),
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
      <HolidayConfigSet visible={visible} onClose={() => setVisible(false)} ></HolidayConfigSet>
    </>
  );
};

export default connect()(HolidayConfig);
