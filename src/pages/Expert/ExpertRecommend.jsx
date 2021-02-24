import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import { Button, Badge } from 'antd';
import { SHARE_TYPE, RECOMMEND_STATUS } from '@/common/constant';
import AuthConsumer from '@/layouts/AuthConsumer';
import Ellipsis from '@/components/Ellipsis';
import PopImgShow from '@/components/PopImgShow';
import TableDataBlock from '@/components/TableDataBlock';
import HandleSetTable from '@/components/HandleSetTable';
import RecommendDetail from './components/Recommend/RecommendDetail';
import OrdersDetail from './components/Recommend/OrdersDetail';
import ReportList from './components/Recommend/ReportList';

const ExpertRecommend = (props) => {
  const { expertRecommend, loading, dispatch } = props;

  const childRef = useRef();
  const [visible, setVisible] = useState(false);
  const [visibleDetailList, setVisibleDetailList] = useState(false);

  // 搜索参数
  const searchItems = [
    {
      label: '类型',
      name: 'contentType',
      type: 'select',
      select: SHARE_TYPE ,
    },
    {
      label: '标题',
      name: 'title',
    },
    {
      label: '手机号',
      name: 'mobile',
    },
    {
      label: '昵称',
      name: 'username',
    },
    {
      label: '状态',
      name: 'status',
      type: 'select',
      select: RECOMMEND_STATUS,
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '种草内容',
      dataIndex: 'frontImage',
      render: (val, detail) => (
        <PopImgShow
          url={val}
          onClick={() => setVisible({ show: true, type: detail.contentType, detail })}
        ></PopImgShow>
      ),
    },
    {
      title: '类型',
      dataIndex: 'contentType',
      render: (val) => (val == 'video' ? '视频' : '图片'),
    },
    {
      title: '标题',
      dataIndex: 'title',
      width: 150,
    },
    {
      title: '哒人昵称',
      dataIndex: 'username',
      render: (val) => (
        <Ellipsis length={8} tooltip>
          {val}
        </Ellipsis>
      ),
    },
    {
      title: '哒人等级',
      align: 'center',
      dataIndex: 'level',
    },
    {
      title: '哒人手机',
      dataIndex: 'mobile',
    },
    {
      title: '视频时长',
      align: 'right',
      dataIndex: 'length',
      render: (val) => (val ? `${val}s` : '--'),
    },
    {
      title: '观看数',
      align: 'right',
      dataIndex: 'viewAmount',
    },
    {
      title: '点赞数',
      align: 'right',
      dataIndex: 'likeAmount',
      render: (val) => val || 0,
    },
    {
      title: '分享数',
      align: 'right',
      dataIndex: 'shareAmount',
      render: (val) => val || 0,
    },
    {
      title: '收藏数',
      align: 'right',
      dataIndex: 'collectionAmount',
      render: (val) => val || 0,
    },
    {
      title: '状态',
      align: 'center',
      dataIndex: 'status',
      render: (val) => RECOMMEND_STATUS[val],
    },
    {
      title: '发布时间',
      align: 'center',
      dataIndex: 'createTime',
    },
    {
      title: '操作',
      align: 'right',
      fixed: 'right',
      dataIndex: 'kolMomentsId',
      render: (kolMomentsId, record) => {
        const { status, userIdString } = record;
        const idObj = { kolMomentsId, userIdString };
        return (
          <>
            <AuthConsumer auth="info">
              <OrdersDetail {...idObj}></OrdersDetail>
            </AuthConsumer>
            <HandleSetTable
              formItems={[
                {
                  type: 'down',
                  visible: status == 1 || status == 5,
                  click: () => fetchExpertRemdStatus({ ...idObj, dropOffFlag: 0 }),
                },
              ]}
            />
          </>
        );
      },
    },
  ];

  useEffect(() => {
    fetchExpertCountReport();
  }, []);

  // 上下架
  const fetchExpertRemdStatus = (values) => {
    dispatch({
      type: 'expertRecommend/fetchExpertRemdStatus',
      payload: values,
      callback: () => childRef.current.fetchGetData(),
    });
  };

  // 获取举报数据数量
  const fetchExpertCountReport = () => {
    dispatch({
      type: 'expertRecommend/fetchExpertCountReport',
    });
  };

  return (
    <>
      <TableDataBlock
        keepData
        btnExtra={
          <AuthConsumer auth="reportCenter">
            <Badge count={expertRecommend.totalReport}>
              <Button className="dkl_green_btn" onClick={() => setVisibleDetailList(true)}>
                举报中心
              </Button>
            </Badge>
          </AuthConsumer>
        }
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.kolMomentsId}`}
        dispatchType="expertRecommend/fetchGetList"
        {...expertRecommend.list}
      ></TableDataBlock>
      <RecommendDetail visible={visible} onClose={() => setVisible(false)}></RecommendDetail>
      <ReportList
        setShowVisible={setVisible}
        visible={visibleDetailList}
        setVisible={setVisibleDetailList}
        fetchExpertCountReport={fetchExpertCountReport}
      ></ReportList>
    </>
  );
};

export default connect(({ expertRecommend, loading }) => ({
  expertRecommend,
  loading:
    loading.effects['expertRecommend/fetchGetList'] ||
    loading.effects['expertRecommend/fetchExpertRemdStatus'],
}))(ExpertRecommend);
