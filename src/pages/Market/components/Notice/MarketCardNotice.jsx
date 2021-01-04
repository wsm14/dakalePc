import React, { useRef, useEffect } from 'react';
import { connect } from 'umi';
import { Button } from 'antd';
import { MARKET_NOTICE_STATUS } from '@/common/constant';
import AuthConsumer from '@/layouts/AuthConsumer';
import Ellipsis from '@/components/Ellipsis';
import NoticeImgShow from '@/components/PopImgShow';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';
import marketCardNoticeSet from './MarketCardNoticeSet';

const MarketCardNotice = (props) => {
  const { marketCardNotice, title, loading, dispatch, setKey } = props;

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
      render: (val) => (
        <Ellipsis length={15} tooltip>
          {val || '--'}
        </Ellipsis>
      ),
    },
    {
      title: '状态',
      align: 'center',
      dataIndex: 'status',
      render: (val) => MARKET_NOTICE_STATUS[val],
    },
    {
      title: '操作',
      align: 'right',
      fixed: 'right',
      dataIndex: 'configAnnounceIdString',
      render: (val, record) => (
        <HandleSetTable
          formItems={[
            {
              type: 'edit',
              visible: record.status === '0',
              click: () => handleNoticeSet(record),
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
          ]}
        />
      ),
    },
  ];

  // 公告发布 / 删除
  const fetchNoticePush = (val, type) => {
    dispatch({
      type: 'marketCardNotice/fetchNoticeSet',
      payload: { ...val, type },
      callback: () => childRef.current.fetchGetData(),
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
  const handleNoticeSet = (initialValues) => {
    dispatch({
      type: 'drawerForm/show',
      payload: marketCardNoticeSet({ dispatch, childRef, initialValues }),
    });
  };

  useEffect(() => {
    handlePageShowBtn();
  }, []);

  const btnExtra = (
    <AuthConsumer auth="noticeAdd">
      <Button className="dkl_green_btn" key="1" onClick={() => handleNoticeSet()}>
        新增公告
      </Button>
    </AuthConsumer>
  );

  return (
    <DataTableBlock
      cRef={childRef}
      loading={loading}
      btnExtra={btnExtra}
      columns={getColumns}
      searchItems={searchItems}
      rowKey={(record) => `${record.configAnnounceIdString}`}
      dispatchType="marketCardNotice/fetchGetList"
      {...marketCardNotice}
    ></DataTableBlock>
  );
};

export default connect(({ marketCardNotice, loading }) => ({
  marketCardNotice,
  loading: loading.models.marketCardNotice,
}))(MarketCardNotice);
