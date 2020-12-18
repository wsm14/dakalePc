import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { NEWS_STATUS } from '@/common/constant';
import { Card } from 'antd';
import Ellipsis from '@/components/Ellipsis';
import PopImgShow from '@/components/PopImgShow';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';
import NewsSet from './components/News/NewsSet';

const tabList = [
  {
    key: 'tab1',
    tab: '动态列表',
  },
  {
    key: 'tab2',
    tab: '新增动态',
  },
];

const ServiceNewsComponent = (props) => {
  const { serviceNews, loading, dispatch } = props;

  const childRef = useRef();
  const [tabkey, setTabKey] = useState('tab1');

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

  const contentList = {
    tab1: (
      <DataTableBlock
        CardNone={false}
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        rowKey={(record) => `${record.newsIdString}`}
        dispatchType="serviceNews/fetchGetList"
        {...serviceNews}
      ></DataTableBlock>
    ),
    tab2: <NewsSet setTabKey={setTabKey}></NewsSet>,
  };

  return (
    <Card tabList={tabList} activeTabKey={tabkey} onTabChange={(key) => setTabKey(key)}>
      {contentList[tabkey]}
    </Card>
  );
};

export default connect(({ serviceNews, loading }) => ({
  serviceNews,
  loading: loading.models.serviceNews,
}))(ServiceNewsComponent);
