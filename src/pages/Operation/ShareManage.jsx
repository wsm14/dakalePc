import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { SHARE_TYPE, SHARE_STATUS } from '@/common/constant';
import Ellipsis from '@/components/Ellipsis';
import PopImgShow from '@/components/PopImgShow';
import TableDataBlock from '@/components/TableDataBlock';
import HandleSetTable from '@/components/HandleSetTable';
import closeRefuse from './components/Share/CloseRefuse';
import ShareDetail from './components/Share/ShareDetail';
import ShareHandleDetail from './components/Share/ShareHandleDetail';

const ShareManage = (props) => {
  const { shareManage, loading, dispatch } = props;

  const childRef = useRef();
  const [visible, setVisible] = useState(false);
  const [visibleHandle, setVisibleHandle] = useState(false);

  // 下架
  const fetchAuditRefuse = (initialValues) => {
    dispatch({
      type: 'drawerForm/show',
      payload: closeRefuse({ dispatch, childRef, initialValues }),
    });
  };

  // 获取详情
  const fetchShareDetail = (val, type) => {
    dispatch({
      type: 'shareManage/fetchShareDetail',
      payload: {
        userMomentIdString: val,
      },
      callback: (detail) => setVisible({ show: true, type, detail }),
    });
  };

  // 获取操作日志详情
  const fetchShareHandleDetail = (val) => {
    dispatch({
      type: 'shareManage/fetchShareHandleDetail',
      payload: {
        identifyIdStr: val,
      },
      callback: (detail) => setVisibleHandle({ show: true, detail }),
    });
  };

  // 搜索参数
  const searchItems = [
    {
      label: '内容标题',
      name: 'title',
    },
    {
      label: '分享类型',
      type: 'select',
      name: 'contentType',
      select: { list: SHARE_TYPE },
    },
    {
      label: '分享状态',
      type: 'select',
      name: 'status',
      select: { list: SHARE_STATUS },
    },
    {
      label: '所属店铺',
      name: 'merchantName',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '种草内容',
      fixed: 'left',
      dataIndex: 'frontImage',
      render: (val) => <PopImgShow url={val}></PopImgShow>,
    },
    {
      title: '内容标题',
      dataIndex: 'title',
      width: 150,
    },
    {
      title: '所属店铺',
      dataIndex: 'merchantName',
      render: (val) => (
        <Ellipsis length={10} tooltip>
          {val}
        </Ellipsis>
      ),
    },
    {
      title: '分享分类',
      align: 'center',
      dataIndex: 'contentType',
      render: (val) => (val == 'video' ? '视频' : '图片'),
    },
    {
      title: '单次打赏卡豆数',
      align: 'right',
      dataIndex: 'beanAmount',
    },
    {
      title: '视频时长',
      align: 'right',
      dataIndex: 'length',
      render: (val) => (val ? `${val}s` : '--'),
    },
    {
      title: '观看人数',
      align: 'right',
      dataIndex: 'viewAmount',
    },
    {
      title: '转发数',
      align: 'right',
      dataIndex: 'forwardAmount',
    },
    {
      title: '卡豆支出',
      align: 'right',
      dataIndex: 'payedBeanAmount',
    },
    {
      title: '分享状态',
      align: 'right',
      dataIndex: 'status',
      render: (val) => SHARE_STATUS[val],
    },
    {
      title: '操作',
      dataIndex: 'userMomentIdString',
      fixed: 'right',
      align: 'right',
      render: (val, record) => {
        const { status } = record;
        return (
          <HandleSetTable
            formItems={[
              {
                type: 'down',
                visible: status == 1 || status == 5,
                click: () => fetchAuditRefuse(record),
              },
              {
                type: 'info',
                click: () => fetchShareDetail(val, record.contentType),
              },
              {
                type: 'own',
                auth: 'handleDeatil',
                title: '操作记录',
                click: () => fetchShareHandleDetail(val),
              },
            ]}
          />
        );
      },
    },
  ];

  return (
    <>
      <TableDataBlock
        keepData
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.userMomentIdString}`}
        dispatchType="shareManage/fetchGetList"
        {...shareManage}
      ></TableDataBlock>
      <ShareDetail visible={visible} onClose={() => setVisible(false)}></ShareDetail>
      <ShareHandleDetail
        visible={visibleHandle}
        onClose={() => setVisibleHandle(false)}
      ></ShareHandleDetail>
    </>
  );
};

export default connect(({ shareManage, loading }) => ({
  shareManage,
  loading: loading.models.shareManage,
}))(ShareManage);
