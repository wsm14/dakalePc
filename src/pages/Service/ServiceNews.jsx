import React, { useRef, useState } from 'react';
import { connect } from 'dva';
import { NEWS_STATUS } from '@/common/constant';
import Ellipsis from '@/components/Ellipsis';
import PopImgShow from '@/components/PopImgShow';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';

const ServiceNewsComponent = (props) => {
  const { serviceNews, loading, dispatch } = props;

  const childRef = useRef();

  // table 表头
  const getColumns = [
    {
      title: '封面图',
      fixed: 'left',
      dataIndex: 'coverImg',
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
      dataIndex: 'description',
      render: (val) => (
        <Ellipsis length={10} tooltip>
          {val || '--'}
        </Ellipsis>
      ),
    },
    {
      title: '发布人',
      dataIndex: 'publisherName',
    },
    {
      title: '发布时间',
      dataIndex: 'createTime',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (val) => NEWS_STATUS[val],
    },
    {
      title: '操作',
      dataIndex: 'newsIdString',
      fixed: 'right',
      align: 'right',
      render: (val, record) => (
        <HandleSetTable
          formItems={[
            {
              type: 'own',
              pop: true,
              visible: record.status === '1',
              title: '下架',
              click: () => fetchNewsStatus({ newsId: val, status: 0 }),
            },
            // {
            //   type: 'own',
            //   pop: true,
            //   visible: record.status === '1',
            //   title: '上架',
            // },
          ]}
        />
      ),
    },
  ];

  // 下架视频
  const fetchNewsStatus = (payload) => {
    dispatch({
      type: 'serviceNews/fetchNewsStatus',
      payload,
      callback: () => childRef.current.fetchGetData(),
    });
  };

  return (
    <DataTableBlock
      cRef={childRef}
      loading={loading}
      columns={getColumns}
      rowKey={(record) => `${record.newsIdString}`}
      dispatchType="serviceNews/fetchGetList"
      {...serviceNews}
    ></DataTableBlock>
  );
};

export default connect(({ serviceNews, loading }) => ({
  serviceNews,
  loading: loading.models.serviceNews,
}))(ServiceNewsComponent);
