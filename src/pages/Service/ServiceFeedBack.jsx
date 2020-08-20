import React, { useRef, useState } from 'react';
import { connect } from 'dva';
import { ACTIVITY_STATUS } from '@/common/constant';
import Ellipsis from '@/components/Ellipsis';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';
import FeedBackDetail from './components/FeedBack/FeedBackDetail';

const ServiceFeedBack = (props) => {
  const { list, loading, dispatch } = props;

  const childRef = useRef();
  const [visible, setVisible] = useState(false);

  // 搜索参数
  const searchItems = [
    {
      label: '反馈人',
      name: 'userMobile1s',
    },
    {
      label: '问题状态',
      name: 'userMosbile1s',
      type: 'select',
      select: { list: ACTIVITY_STATUS },
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '反馈人',
      dataIndex: 'userId',
    },
    {
      title: '身份',
      align: 'center',
      dataIndex: 'phoneNumber',
    },
    {
      title: '问题描述',
      align: 'left',
      dataIndex: 'orderCount',
      render: (val) => (
        <Ellipsis length={10} tooltip>
          {val}
        </Ellipsis>
      ),
    },
    {
      title: '反馈时间',
      align: 'left',
      dataIndex: 'orderTotal',
    },
    {
      title: '问题状态',
      align: 'left',
      dataIndex: 'parkName',
      render: (val) => ACTIVITY_STATUS[val],
    },
    {
      title: '操作人',
      align: 'center',
      dataIndex: 'addTimeStamp',
      render: (val) => (val ? val : '--'),
    },
    {
      title: '操作时间',
      align: 'center',
      dataIndex: 'addTimeStamp',
      render: (val) => (val ? val : '--'),
    },
    {
      title: '操作',
      dataIndex: 'id',
      fixed: 'right',
      align: 'right',
      render: (val, record) => (
        <HandleSetTable
          formItems={[
            {
              type: 'own',
              title: '查看',
              click: () => fetchFeedBackDetail(val),
            },
            {
              type: 'own',
              title: '回复',
              click: () => fetchFeedBackDetail(val),
            },
          ]}
        />
      ),
    },
  ];

  // 获取反馈详情
  const fetchFeedBackDetail = (val) => {
    console.log(val);
    // dispatch({
    //   type: 'serviceFeedBack/fetchFeedBackDetail',
    //   payload: { val },
    //   callback: (info) => setVisible({show: true, info}),
    // });
  };

  return (
    <>
      <DataTableBlock
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.userId}`}
        dispatchType="serviceFeedBack/fetchGetList"
        {...list}
        list={[{ name: 1 }]}
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
