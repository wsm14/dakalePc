import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { FEEDBACK_STATUS, FEEDBACK_TYPE } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';
import FeedBackDetail from './components/FeedBack/FeedBackDetail';
import FeedBackSet from './components/FeedBack/FeedBackSet';

const ServiceFeedBack = (props) => {
  const { list, loading, dispatch } = props;

  const childRef = useRef();
  const [visible, setVisible] = useState(false);
  const [visibleSet, setVisibleSet] = useState(false);

  // 搜索参数
  const searchItems = [
    {
      label: '反馈人',
      name: 'username',
    },
    {
      label: '反馈类型',
      name: 'feedbackType',
      type: 'select',
      select: FEEDBACK_TYPE,
    },
    {
      label: '问题状态',
      name: 'status',
      type: 'select',
      select: FEEDBACK_STATUS,
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '反馈人',
      dataIndex: 'userName',
    },
    {
      title: '身份',
      dataIndex: 'identity',
    },
    {
      title: '反馈类型',
      dataIndex: 'feedbackType',
      render: (val) => FEEDBACK_TYPE[val],
    },
    {
      title: '问题描述',
      dataIndex: 'problemDesc',
      ellipsis: true,
    },
    {
      title: '反馈时间',
      align: 'center',
      dataIndex: 'createTime',
    },
    {
      title: '问题状态',
      align: 'center',
      dataIndex: 'status',
      render: (val) => FEEDBACK_STATUS[val],
    },
    {
      title: '回复人',
      align: 'center',
      dataIndex: 'operator',
      render: (val) => (val ? val : '--'),
    },
    {
      title: '回复时间',
      align: 'center',
      dataIndex: 'replayTime',
      render: (val) => (val ? val : '--'),
    },
    {
      type: 'handle',
      dataIndex: 'feedbackIdString',
      render: (feedbackIdString, info) => [
        {
          type: 'eye',
          visible: info.status === '2',
          click: () => fetchFeedBackDetail({ feedbackIdString }),
        },
        {
          type: 'replay',
          visible: info.status !== '2',
          click: () => fetchFeedBackDetail({ feedbackIdString }),
        },
      ],
    },
  ];

  // 获取问题反馈详情
  const fetchFeedBackDetail = (payload) => {
    dispatch({
      type: 'serviceFeedBack/fetchFeedBackDetail',
      payload,
      callback: (info) => setVisible({ show: true, info }),
    });
  };

  const extraBtn = [
    { auth: 'config', text: '配置', onClick: () => setVisibleSet({ show: true, info: {} }) },
  ];

  return (
    <>
      <TableDataBlock
        
        btnExtra={extraBtn}
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.feedbackIdString}`}
        dispatchType="serviceFeedBack/fetchGetList"
        {...list}
      ></TableDataBlock>
      <FeedBackDetail
        cRef={childRef}
        visible={visible}
        onClose={() => setVisible({ show: false, info: {} })}
      ></FeedBackDetail>
      <FeedBackSet
        cRef={childRef}
        visible={visibleSet}
        onClose={() => setVisibleSet(false)}
      ></FeedBackSet>
    </>
  );
};

export default connect(({ serviceFeedBack, loading }) => ({
  list: serviceFeedBack.list,
  loading: loading.effects['serviceFeedBack/fetchGetList'],
}))(ServiceFeedBack);
