import React, { useState, useRef } from 'react';
import { connect } from 'umi';
import Ellipsis from '@/components/Ellipsis';
import PopImgShow from '@/components/PopImgShow';
import HandleSetTable from '@/components/HandleSetTable';
import TableDataBlock from '@/components/TableDataBlock';
const NoCheck = (props) => {
  const childRef = useRef();
  const { loading } = props;
  const searchItems = [
    {
      label: '关键字',
      name: 'keyWords',
    },
    {
      label: '申请日期',
      type: 'rangePicker',
      name: 'applyTimeStart',
      end: 'aplyTimeEnd',
    },
    {
      label: '所属区县',
      name: 'city',
      type: 'cascader',
      changeOnSelect: true,
      valuesKey: ['provinceCode', 'cityCode', 'districtCode'],
    },
  ];
  const getColumns = [
    {
      title: '占位图',
      fixed: 'left',
      dataIndex: 'coverImg',
      render: (val) => <PopImgShow url={val} />,
    },
    {
      title: '图片说明',
      dataIndex: 'coverImg',
    },
    {
      title: '位置',
      dataIndex: 'coverImg',
    },
    {
      title: '可见范围',
      dataIndex: 'coverImg',
    },
    {
      title: '点击事件',
      dataIndex: 'coverImg',
    },
    {
      title: '跳转内容',
      dataIndex: 'coverImg',
    },
    {
      title: '展示时间',
      dataIndex: 'coverImg',
    },
    {
      title: '所属区县',
      dataIndex: 'coverImg',
    },
    {
      title: '操作类型',
      dataIndex: 'coverImg',
    },
    {
      title: '申请人',
      dataIndex: 'coverImg',
    },
    {
      title: '申请时间',
      dataIndex: 'coverImg',
    },

    {
      title: '操作',
      dataIndex: 'coverImg',
      render: (val, record) => (
        <HandleSetTable
          formItems={[
            {
              type: 'info',
            },
            {
              type: 'check',
            },
          ]}
        />
      ),
    },
  ];

  return (
    <>
      <TableDataBlock
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.puzzleAdsId}`}
        dispatchType=""
      ></TableDataBlock>
    </>
  );
};
export default connect()(NoCheck);
