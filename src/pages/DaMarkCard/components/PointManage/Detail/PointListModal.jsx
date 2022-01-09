import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import TableDataBlock from '@/components/TableDataBlock';
import PointDrawer from './Point/PointDrawer';

const PointListModal = (props) => {
  const { loading, pointList, detail, dispatch } = props;

  const childRef = useRef();

  const [visible, setVisible] = useState(false);

  // 搜索参数
  const searchItems = [
    {
      label: '点位',
      name: 'name',
      placeholder: '请输入点位名称',
    },
  ];

  // 表头
  const getColumns = [
    {
      title: '点位编号',
      align: 'center',
      dataIndex: 'hittingId',
    },
    {
      title: '点位名称',
      align: 'center',
      dataIndex: 'name',
    },
    {
      title: '点位地址',
      align: 'center',
      dataIndex: 'address',
    },
    {
      title: '状态',
      align: 'center',
      dataIndex: 'status',
      render: (val) => ['停用', '启用'][val],
    },
    {
      type: 'handle',
      dataIndex: 'hittingId',
      render: (hittingId, record) => {
        return [
          {
            type: 'edit',
            click: () => fetchPointDetail(hittingId, 'edit'),
          },
          {
            title: '下载打卡码',
            auth: true,
            type: 'downloadQR',
            // click: () => setVisibleModalDrawer({ show: true, detail: record, type: 'signDetail' }),
          },
        ];
      },
    },
  ];

  // 获取点位详情
  const fetchPointDetail = (hittingId, type) => {
    dispatch({
      type: 'pointManage/fetchGetHittingById',
      payload: {
        hittingId,
      },
      callback: (detail) => {
        setVisible({ type, show: true, detail });
      },
    });
  };

  // 权限按钮
  const btnList = [
    {
      text: '新增',
      auth: 'save',
      onClick: () => setVisible({ type: 'add', show: true }),
    },
  ];

  return (
    <>
      <TableDataBlock
        btnExtra={btnList}
        order
        cRef={childRef}
        noCard={false}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.hittingId}`}
        dispatchType="pointManage/fetchListHitting"
        params={{ mainId: detail.hittingMainId }}
        {...pointList}
      ></TableDataBlock>
      {/* 新增 编辑 详情 */}
      <PointDrawer
        childRef={childRef}
        visible={visible}
        onClose={() => setVisible(false)}
      ></PointDrawer>
    </>
  );
};

export default connect(({ pointManage, loading }) => ({
  pointList: pointManage.pointList,
  loading: loading.effects['pointManage/fetchListHitting'],
}))(PointListModal);
