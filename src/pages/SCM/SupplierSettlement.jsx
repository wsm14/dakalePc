import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import TableDataBlock from '@/components/TableDataBlock';
import SettlementDrawer from './components/SupplierSettlement/SettlementDrawer';

const SupplierSettlement = (props) => {
  const { commentManage, loading, dispatch } = props;

  const childRef = useRef();
  const [visible, setVisible] = useState({ mode: 'info', show: false, detail: {} });

  // 搜索参数
  const searchItems = [
    {
      label: '供应商名称',
      name: 'userId',
      type: 'user',
    },
    {
      label: '结算流水号',
      name: 'momentId',
    },
    {
      label: '结算时间',
      type: 'rangePicker',
      name: 'createBeginTime',
      end: 'createEndTime',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '供应商名称',
      dataIndex: 'momentCommentIdString',
      ellipsis: { length: 15 },
    },
    {
      title: '结算流水号',
      dataIndex: 'deleteFlag',
    },
    {
      title: '结算金额',
      dataIndex: 'createTime',
      render: (val, row) => `￥${row.mobile}`,
    },
    {
      title: '结算时间',
      dataIndex: 'u sername',
    },
    {
      title: '制单人',
      dataIndex: 'momentIdString',
    },
    {
      title: '制单时间',
      dataIndex: 'deleteFlag',
    },
    {
      title: '操作',
      type: 'handle',
      dataIndex: 'deleteFlag',
      render: (val, row, index) => [
        {
          type: 'info',
          click: () => fetchGetSettlementDetail(index, 'info'),
        },
        {
          type: 'edit',
          click: () => fetchDel(val, row.momentCommentIdString),
        },
      ],
    },
  ];

  // 获取详情
  const fetchGetSettlementDetail = (index, mode) => {
    const { hittingId } = commentManage.list[index];
    dispatch({
      type: 'pointManage/fetchGetHittingById',
      payload: {
        hittingId,
      },
      callback: (detail) => {
        setVisible({ mode, show: true, index, detail, hittingId });
      },
    });
  };

  const fetchDel = (deleteFlag) => {
    dispatch({
      type: 'commentManage/fetchUpdateCommentsDeleteFlag',
      payload: {
        deleteFlag: deleteFlag == '0' ? 1 : 0,
      },
      callback: childRef.current.fetchGetData,
    });
  };

  const btnList = [
    {
      auth: 'save',
      text: '新增',
      onClick: () => setVisible({ mode: 'add', show: true }),
    },
  ];

  return (
    <>
      <TableDataBlock
        order
        cRef={childRef}
        btnExtra={btnList}
        loading={loading}
        searchItems={searchItems}
        columns={getColumns}
        rowKey={(record) => `${record.momentCommentIdString}`}
        dispatchType="commentManage/fetchGetList"
        {...commentManage}
      ></TableDataBlock>
      {/* 详情编辑新增 */}
      <SettlementDrawer
        visible={visible}
        getDetail={fetchGetSettlementDetail}
        onClose={() => setVisible(false)}
      ></SettlementDrawer>
    </>
  );
};
export default connect(({ commentManage, loading }) => ({
  commentManage,
  loading: loading.models.commentManage,
}))(SupplierSettlement);
