import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import TableDataBlock from '@/components/TableDataBlock';
import UserFollowDetail from './components/UserFollow/UserFollowDetail';
const UserFollow = (props) => {
  const childRef = useRef();
  const [visibleInfo, setVisibleInfo] = useState(false);
  // 搜索参数
  const searchItems = [
    {
      label: '用户',
      type: 'user',
      name: 'userId',
    },
    {
      label: '跟进人',
      name: 'people',
    },
    {
      label: '跟进标签',
      name: 'people',
    },
    {
      label: '跟进方式',
      name: 'people',
    },
    {
      label: '跟进类型',
      name: 'people',
      type: 'select',
    },
    {
      label: '跟进时间',
      type: 'rangePicker',
      name: 'createBeginTime',
      end: 'createEndTime',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '用户昵称',
      dataIndex: 'id',
    },
    {
      title: '注册手机号',
      dataIndex: 'id',
      width: 300,
      ellipsis: { length: 50 },
    },
    {
      title: '性别',
      dataIndex: 'id',
    },
    {
      title: '跟进方式',
      dataIndex: 'id',
    },
    {
      title: '跟进类型',
      dataIndex: 'id',
    },
    {
      title: '跟进内容',
      dataIndex: 'status',
    },
    {
      title: '跟进标签',
      dataIndex: 'status',
    },
    {
      title: '跟进结果',
      dataIndex: 'status',
    },
    {
      title: '跟进人',
      dataIndex: 'status',
    },
    {
      title: '跟进时间',
      dataIndex: 'status',
    },
    {
      title: '操作',
      type: 'handle',
      dataIndex: 'status',
      render: (val) => [
        {
          type: 'info',
          click: () => fetchDetail(),
        },
        {
          type: 'edit',
          // click: () => fetchFeedBackDetail({ feedbackIdString }),
        },
      ],
    },
  ];

  const fetchDetail = () => {
    setVisibleInfo({
      show: true,
      detail: {},
    });
  };

  return (
    <>
      <TableDataBlock
        order
        cRef={childRef}
        //   loading={loading}
        searchItems={searchItems}
        columns={getColumns}
        rowKey={(record) => `${record.newsIdString}`}
        dispatchType="serviceNews/fetchGetList"
        //   {...serviceNews}
      ></TableDataBlock>
      <UserFollowDetail
        visible={visibleInfo}
        onClose={() => setVisibleInfo(false)}
      ></UserFollowDetail>
    </>
  );
};

export default connect()(UserFollow);
