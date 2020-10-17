import React, { useRef, useState } from 'react';
import { connect } from 'dva';
import { FEEDBACK_STATUS } from '@/common/constant';
import Ellipsis from '@/components/Ellipsis';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';
import FeedBackDetail from './components/FeedBack/FeedBackDetail';

const ServiceFeedBack = (props) => {
  const { list, loading } = props;

  const childRef = useRef();
  const [visible, setVisible] = useState(false);

  // 搜索参数
  const searchItems = [
    {
      label: '反馈人',
      name: 'username',
    },
    {
      label: '问题状态',
      name: 'status',
      type: 'select',
      select: { list: FEEDBACK_STATUS },
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
      align: 'center',
      dataIndex: 'userType',
      render: (val) => (val === 'user' ? '用户' : '商家'),
    },
    {
      title: '问题描述',
      align: 'left',
      dataIndex: 'problemDesc',
      render: (val) => (
        <Ellipsis length={10} tooltip>
          {val}
        </Ellipsis>
      ),
    },
    {
      title: '反馈时间',
      align: 'left',
      dataIndex: 'createTime',
    },
    {
      title: '问题状态',
      align: 'left',
      dataIndex: 'status',
      render: (val) => FEEDBACK_STATUS[val],
    },
    {
      title: '操作人',
      align: 'center',
      dataIndex: 'operator',
      render: (val) => (val ? val : '--'),
    },
    {
      title: '操作时间',
      align: 'center',
      dataIndex: 'replayTime',
      render: (val) => (val ? val : '--'),
    },
    {
      title: '操作',
      dataIndex: 'feedbackIdString',
      fixed: 'right',
      align: 'right',
      render: (val, info) => (
        <HandleSetTable
          formItems={[
            {
              type: 'own',
              title: '查看',
              visible: info.status === '2',
              click: () => setVisible({ show: true, info }),
            },
            {
              type: 'own',
              title: '回复',
              visible: info.status !== '2',
              click: () => setVisible({ show: true, info }),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <>
      <DataTableBlock
        keepName="问题反馈"
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.feedbackIdString}`}
        dispatchType="serviceFeedBack/fetchGetList"
        {...list}
      ></DataTableBlock>
      <FeedBackDetail
        cRef={childRef}
        visible={visible}
        onClose={() => setVisible({ show: false, info: {} })}
      ></FeedBackDetail>
    </>
  );
};

export default connect(({ serviceFeedBack, loading }) => ({
  list: serviceFeedBack.list,
  loading: loading.effects['serviceFeedBack/fetchGetList'],
}))(ServiceFeedBack);
