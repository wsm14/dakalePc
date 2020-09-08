import React, { useRef, useState } from 'react';
import { connect } from 'dva';
import Ellipsis from '@/components/Ellipsis';
import PopImgShow from '@/components/PopImgShow';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';

const ServiceNewsComponent = (props) => {
  const { businessVideo, loading, dispatch } = props;

  const childRef = useRef();

  // table 表头
  const getColumns = [
    {
      title: '封面图',
      fixed: 'left',
      dataIndex: 'frontImage',
      render: (val) => <PopImgShow url={val} />,
    },
    {
      title: '标题',
      dataIndex: 'title',
      render: (val) => (
        <Ellipsis length={10} tooltip>
          {val || '--'}
        </Ellipsis>
      ),
    },
    {
      title: '内容简介',
      dataIndex: 'usersdname',
      render: (val) => (
        <Ellipsis length={10} tooltip>
          {val || '--'}
        </Ellipsis>
      ),
    },
    {
      title: '发布人',
      dataIndex: 'usernsame',
    },
    {
      title: '发布时间',
      dataIndex: 'usernasame',
    },
    {
      title: '状态',
      dataIndex: 'usessrname',
    },
    {
      title: '操作',
      dataIndex: 'merchantIdString',
      fixed: 'right',
      align: 'right',
      render: (val, record) => (
        <HandleSetTable
          formItems={[
            {
              type: 'own',
              pop: true,
              title: '下架',
            },
            {
              type: 'own',
              pop: true,
              title: '上架',
            },
          ]}
        />
      ),
    },
  ];

  return (
    <DataTableBlock
      cRef={childRef}
      loading={loading}
      columns={getColumns}
      rowKey={(record) => `${record.userMomentIdString}`}
      dispatchType="businessVideo/fetchGetList"
      {...businessVideo}
    ></DataTableBlock>
  );
};

export default connect(({ businessVideo, loading }) => ({
  businessVideo,
  loading: loading.models.businessVideo,
}))(ServiceNewsComponent);
