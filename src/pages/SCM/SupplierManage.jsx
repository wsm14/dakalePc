import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { COMMENT_DELETFLAG } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';

const SupplierManage = (props) => {
  const { supplierManage, loading, dispatch } = props;

  const childRef = useRef();
  const [commentList, setCommentList] = useState([]);

  // 搜索参数
  const searchItems = [
    {
      label: '用户',
      name: 'userId',
      type: 'user',
    },
    {
      label: '视频ID',
      name: 'momentId',
    },
    {
      label: '状态',
      type: 'select',
      name: 'deleteFlag',
      select: COMMENT_DELETFLAG,
    },
    {
      label: '评论ID',
      name: 'momentCommentId',
    },
    {
      label: '评论内容',
      name: 'content',
    },
    {
      label: '评论时间',
      type: 'rangePicker',
      name: 'createBeginTime',
      end: 'createEndTime',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '评论ID',
      dataIndex: 'momentCommentIdString',
    },
    {
      title: '评论内容',
      dataIndex: 'content',
      width: 300,
      ellipsis: { length: 15 },
    },
    {
      title: '评论时间',
      dataIndex: 'createTime',
    },
    {
      title: '用户信息',
      dataIndex: 'username',
      render: (val, row) => `${val}\n${row.mobile}`,
    },
    {
      title: '视频ID',
      dataIndex: 'momentIdString',
    },
    {
      title: '状态',
      dataIndex: 'deleteFlag',
      render: (val) => COMMENT_DELETFLAG[val],
    },
    {
      title: '操作',
      type: 'handle',
      dataIndex: 'deleteFlag',
      render: (val, row) => [
        {
          type: 'del',
          visible: val === '1',
          click: () => fetchDel(val, row.momentCommentIdString),
        },
        {
          type: 'recover',
          visible: val === '0',
          click: () => fetchDel(val, row.momentCommentIdString),
        },
      ],
    },
  ];
  const fetchDel = (deleteFlag, momentCommentIds) => {
    dispatch({
      type: 'commentManage/fetchUpdateCommentsDeleteFlag',
      payload: {
        deleteFlag: deleteFlag == '0' ? 1 : 0,
        momentCommentIds: momentCommentIds ? momentCommentIds : commentList.toString(),
      },
      callback: childRef.current.fetchGetData,
    });
  };
  const btnList = [
    {
      auth: 'del',
      disabled: !commentList.length,
      onClick: fetchDel,
      text: '批量删除',
    },
  ];
  return (
    <TableDataBlock
      cRef={childRef}
      btnExtra={btnList}
      loading={loading}
      searchItems={searchItems}
      columns={getColumns}
      rowKey={(record) => `${record.momentCommentIdString}`}
      dispatchType="supplierManage/fetchGetList"
      rowSelection={{ onChange: setCommentList }}
      {...supplierManage}
    ></TableDataBlock>
  );
};
export default connect(({ supplierManage, loading }) => ({
  supplierManage,
  loading: loading.models.supplierManage,
}))(SupplierManage);
