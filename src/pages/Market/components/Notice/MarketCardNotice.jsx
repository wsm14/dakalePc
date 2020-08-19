import React, { useRef, useEffect } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import { MARKET_NOTICE_STATUS } from '@/common/constant';
import Ellipsis from '@/components/Ellipsis';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';
import NoticeImgShow from './NoticeImgShow';
import marketCardNoticeSet from './MarketCardNoticeSet';

const MarketCardNotice = (props) => {
  const { marketCardNotice, title, loading, dispatch, setKey } = props;

  const childRef = useRef();

  // 搜索参数
  const searchItems = [
    {
      label: '公告说明',
      name: 'date',
    },
  ];

  const getColumns = [
    {
      title: '缩略图',
      align: 'center',
      fixed: 'left',
      dataIndex: 'startDate',
      render: (val) => <NoticeImgShow url={val} />,
    },
    {
      title: '公告说明',
      align: 'center',
      dataIndex: 'signBeanAmount',
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
      dataIndex: 'id',
      render: (val, record) => (
        <HandleSetTable
          formItems={[
            {
              type: 'edit',
              visible: record.status === '0',
              click: () => setVisible({ type: 'destory', record }),
            },
            {
              type: 'del',
              visible: record.status === '0',
              click: () => fetchNoticePush(val, 'del'),
            },
            {
              type: 'send',
              visible: record.status === '0',
              click: () => fetchNoticePush(val, 'push'),
            },
          ]}
        />
      ),
    },
  ];

  // 公告发布 / 删除
  const fetchNoticePush = (val, type) => {
    dispatch({
      type: {
        push: 'marketCardNotice/fetchNoticePush',
        del: 'marketCardNotice/fetchNoticeDel',
      }[type],
      payload: { val },
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

  // 新增公告表单
  const handleNoticeAdd = () => {
    dispatch({
      type: 'drawerForm/show',
      payload: marketCardNoticeSet({ dispatch, childRef }),
    });
  };

  useEffect(() => {
    handlePageShowBtn();
  }, []);

  const btnExtra = [
    <Button className="dkl_green_btn" key="1" onClick={handleNoticeAdd}>
      新增公告
    </Button>,
  ];

  return (
    <DataTableBlock
      cRef={childRef}
      loading={loading}
      btnExtra={btnExtra}
      columns={getColumns}
      searchItems={searchItems}
      rowKey={(record) => `${record.startDate}`}
      dispatchType="marketCardNotice/fetchGetList"
      {...marketCardNotice}
    ></DataTableBlock>
  );
};

export default connect(({ marketCardNotice, loading }) => ({
  marketCardNotice,
  loading: loading.models.marketCardNotice,
}))(MarketCardNotice);
