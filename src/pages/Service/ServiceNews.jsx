import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { NEWS_STATUS } from '@/common/constant';
import { Card, Result } from 'antd';
import AuthConsumer from '@/layouts/AuthConsumer';
import PopImgShow from '@/components/PopImgShow';
import TableDataBlock from '@/components/TableDataBlock';
import NewsSet from './components/News/NewsSet';

const tabList = [
  {
    key: 'tab1',
    auth: 'newsList',
    tab: '动态列表',
  },
  {
    key: 'tab2',
    auth: 'save',
    tab: '新增动态',
  },
];

const ServiceNewsComponent = (props) => {
  const { serviceNews, loading, dispatch } = props;

  const childRef = useRef();
  const [tabkey, setTabKey] = useState('tab1');
  const [detail, setDetail] = useState({});

  // 搜索参数
  const searchItems = [
    {
      label: '状态',
      name: 'status',
      type: 'select',
      select: NEWS_STATUS,
    },
    {
      label: '标题',
      name: 'title',
    },
  ];

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
      width: 300,
      render: (val) => val,
    },
    {
      title: '内容简介',
      dataIndex: 'description',
      width: 300,
      ellipsis: { length: 50 },
    },
    {
      title: '更新人',
      align: 'center',
      dataIndex: 'updater',
      render: (val, row) => val || row.publisherName,
    },
    {
      title: '更新时间',
      align: 'center',
      dataIndex: 'updateTime',
    },
    {
      title: '状态',
      align: 'center',
      dataIndex: 'status',
      render: (val) => NEWS_STATUS[val],
    },
    {
      type: 'handle',
      dataIndex: 'newsIdString',
      render: (val, record) => [
        {
          type: 'down',
          visible: record.status === '0',
          click: () => fetchNewsStatus({ newsId: val, status: 0 }),
        },
        {
          type: 'edit',
          click: () => {
            setDetail(record);
            setTabKey('tab2');
          },
        },
      ],
    },
  ];

  // 下架
  const fetchNewsStatus = (payload) => {
    dispatch({
      type: 'serviceNews/fetchNewsStatus',
      payload,
      callback: childRef.current.fetchGetData,
    });
  };

  const contentList = {
    tab1: (
      <TableDataBlock
        noCard={false}
        cRef={childRef}
        loading={loading}
        searchItems={searchItems}
        columns={getColumns}
        rowKey={(record) => `${record.newsIdString}`}
        dispatchType="serviceNews/fetchGetList"
        {...serviceNews}
      ></TableDataBlock>
    ),
    tab2: (
      <AuthConsumer
        auth="save"
        noAuth={<Result status="403" title="403" subTitle="暂无权限"></Result>}
      >
        <NewsSet setTabKey={setTabKey} detail={detail}></NewsSet>
      </AuthConsumer>
    ),
  };

  return (
    <Card
      tabList={tabList}
      activeTabKey={tabkey}
      onTabChange={(key) => {
        setTabKey(key);
        key === 'tab1' && setDetail({});
      }}
    >
      {contentList[tabkey]}
    </Card>
  );
};

export default connect(({ serviceNews, loading }) => ({
  serviceNews,
  loading: loading.models.serviceNews,
}))(ServiceNewsComponent);
