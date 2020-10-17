import React, { useRef } from 'react';
import { connect } from 'dva';
import PopImgShow from '@/components/PopImgShow';
import DataTableBlock from '@/components/DataTableBlock';

const ExpertLevel = (props) => {
  const { list, loading, dispatch } = props;

  const childRef = useRef();

  // table 表头
  const getColumns = [
    {
      title: '等级形象',
      fixed: 'left',
      dataIndex: 'userIdString',
      render: (val) => <PopImgShow url={val} />,
    },
    {
      title: '等级名称',
      dataIndex: 'mobile',
    },
    {
      title: '等级任务',
      align: 'left',
      dataIndex: 'username',
      render: (val) => val || '--',
    },
    {
      title: '等级权益',
      align: 'center',
      dataIndex: 'gender',
      render: (val) => val || '--',
    },
  ];

  return (
    <DataTableBlock
      keepName="等级设置"
      cRef={childRef}
      loading={loading}
      columns={getColumns}
      rowKey={(record) => `${record.userIdString}`}
      NoSearch={true}
      dispatchType="userList/fetchGetList"
      list={list}
    ></DataTableBlock>
  );
};

export default connect(({ userList, loading }) => ({
  list: userList.list,
  loading: loading.effects['userList/fetchGetList'],
}))(ExpertLevel);
