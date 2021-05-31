import React, { useRef, useEffect, useState } from 'react';
import { connect } from 'umi';
import { Button } from 'antd';
import { MARKET_NOTICE_STATUS } from '@/common/constant';
import AuthConsumer from '@/layouts/AuthConsumer';
import NoticeImgShow from '@/components/PopImgShow';
import TableDataBlock from '@/components/TableDataBlock';
import MarketCardNoticeSet from './MarketCardNoticeSet';

const MarketCardNotice = (props) => {
  const { marketCardNotice, title, loading, dispatch, setKey } = props;

  const [visibleSet, setVisibleSet] = useState(false);

  const childRef = useRef();

  // 搜索参数
  const searchItems = [
    {
      label: '公告说明',
      name: 'description',
    },
  ];

  const getColumns = [
    {
      title: '缩略图',
      align: 'center',
      fixed: 'left',
      dataIndex: 'image',
      render: (val) => <NoticeImgShow url={val} />,
    },
    {
      title: '公告说明',
      align: 'center',
      dataIndex: 'description',
      ellipsis: true,
    },
    {
      title: '状态',
      align: 'center',
      dataIndex: 'status',
      render: (val) => MARKET_NOTICE_STATUS[val],
    },
    {
      type: 'handle',
      dataIndex: 'configAnnounceIdString',
      render: (val, record) => [
        {
          type: 'edit',
          visible: record.status === '0',
          click: () => handleNoticeSet('edit', record),
        },
        {
          type: 'del',
          visible: record.status === '0',
          click: () => fetchNoticePush({ configAnnounceId: val, deleteFlag: 0 }, 'del'),
        },
        {
          type: 'send',
          visible: record.status === '0',
          click: () => fetchNoticePush({ configAnnounceId: val, status: 1 }, 'push'),
        },
      ]
    },
  ];

  // 公告发布 / 删除
  const fetchNoticePush = (val, type) => {
    dispatch({
      type: 'marketCardNotice/fetchNoticeSet',
      payload: { ...val, type },
      callback: childRef.current.fetchGetData,
    });
  };

  // 头部添加面包屑 按钮
  const handlePageShowBtn = () => {
    dispatch({
      type: 'global/saveTitle',
      payload: {
        pageTitle: [title],
        pageBtn: [
          <Button type="danger" key="btn" onClick={handlePageBtnBack}>
            返回
          </Button>,
        ],
      },
    });
  };

  // 头部添加按钮返回
  const handlePageBtnBack = () => {
    setKey('home');
    dispatch({
      type: 'global/closeTitle',
    });
  };

  // 设置公告表单
  const handleNoticeSet = (type, initialValues) => {
    setVisibleSet({
      show: true,
      type,
      initialValues,
    });
  };

  useEffect(() => {
    handlePageShowBtn();
  }, []);

  const btnExtra = (
    <AuthConsumer auth="noticeAdd">
      <Button className="dkl_green_btn" key="1" onClick={() => handleNoticeSet('add')}>
        新增公告
      </Button>
    </AuthConsumer>
  );

  return (
    <>
      <TableDataBlock
        cRef={childRef}
        loading={loading}
        btnExtra={btnExtra}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.configAnnounceIdString}`}
        dispatchType="marketCardNotice/fetchGetList"
        {...marketCardNotice}
      ></TableDataBlock>
      <MarketCardNoticeSet
        visible={visibleSet}
        childRef={childRef}
        onClose={() => setVisibleSet(false)}
      ></MarketCardNoticeSet>
    </>
  );
};

export default connect(({ marketCardNotice, loading }) => ({
  marketCardNotice,
  loading: loading.models.marketCardNotice,
}))(MarketCardNotice);
