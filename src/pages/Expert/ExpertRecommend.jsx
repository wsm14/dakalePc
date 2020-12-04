import React, { useRef, useState } from 'react';
import { connect } from 'dva';
import { SHARE_TYPE, RECOMMEND_STATUS } from '@/common/constant';
import PopImgShow from '@/components/PopImgShow';
import DataTableBlock from '@/components/DataTableBlock';
import HandleSetTable from '@/components/HandleSetTable';
import RecommendDetail from './components/Recommend/RecommendDetail';
import OrdersDetail from './components/Recommend/OrdersDetail';

const ExpertRecommend = (props) => {
  const { expertRecommend, loading, dispatch } = props;

  const childRef = useRef();
  const [visible, setVisible] = useState(false);

  // 搜索参数
  const searchItems = [
    {
      label: '类型',
      name: 'contentType',
      type: 'select',
      select: { list: SHARE_TYPE },
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
      select: { list: RECOMMEND_STATUS },
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
      dataIndex: 'kolMomentsId',
      render: (kolMomentsId, record) => {
        const { status, userIdString } = record;
        const idObj = { kolMomentsId, userIdString };
        return (
          <>
            <OrdersDetail {...idObj}></OrdersDetail>
            <HandleSetTable
              formItems={[
                {
                  type: 'up',
                  visible: status == 3,
                  click: () => fetchExpertRemdStatus({ ...idObj, dropOffFlag: 1 }),
                },
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

  // 上下架
  const fetchExpertRemdStatus = (values) => {
    dispatch({
      type: 'expertRecommend/fetchExpertRemdStatus',
      payload: values,
      callback: () => childRef.current.fetchGetData(),
    });
  };

  return (
    <>
      <DataTableBlock
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.kolMomentsId}`}
        dispatchType="expertRecommend/fetchGetList"
        {...expertRecommend.list}
      ></DataTableBlock>
      <RecommendDetail visible={visible} onClose={() => setVisible(false)}></RecommendDetail>
    </>
  );
};

export default connect(({ expertRecommend, loading }) => ({
  expertRecommend,
  loading: loading.models.expertRecommend,
}))(ExpertRecommend);
