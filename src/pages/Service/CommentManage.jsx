import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import TableDataBlock from '@/components/TableDataBlock';
const CommentManage = (props) => {
  const childRef = useRef();
  // 搜索参数
  const searchItems = [
    {
      label: '用户',
      name: 'username',
    },
    {
      label: '视频ID',
      name: 'status',
    },
    {
      label: '状态',
      type: 'select',
      name: 'status',
    },
    {
      label: '评论ID',
      name: 'status',
    },
    {
      label: '评论内容',
      name: 'status',
    },
    {
      label: '评论时间',
      type: 'rangePicker',
      name: 'commentStartTime',
      end: 'commentEndTime',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '评论ID',
      dataIndex: 'id',
    },
    {
      title: '评论内容',
      dataIndex: 'id',
      width: 300,
      ellipsis: { length: 50 },
    },
    {
      title: '评论时间',
      dataIndex: 'id',
    },
    {
      title: '用户信息',
      dataIndex: 'id',
    },
    {
      title: '视频ID',
      dataIndex: 'id',
    },
    {
      title: '状态',
      dataIndex: 'status',
    },
    {
      title: '操作',
      type: 'handle',
      dataIndex: 'status',
      render: (val) => [
        {
          type: 'delete',
          // click: () => fetchFeedBackDetail({ feedbackIdString }),
        },
        {
          type: 'recover',
          // click: () => fetchFeedBackDetail({ feedbackIdString }),
        },
      ],
    },
  ];

  return (
    <TableDataBlock
      cRef={childRef}
      //   loading={loading}
      searchItems={searchItems}
      columns={getColumns}
      rowKey={(record) => `${record.newsIdString}`}
      dispatchType="serviceNews/fetchGetList"
    //   {...serviceNews}
    ></TableDataBlock>
  );
};
export default connect()(CommentManage);
