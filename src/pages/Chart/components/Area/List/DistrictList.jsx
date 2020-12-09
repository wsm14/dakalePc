import React, { useRef } from 'react';
import { connect } from 'dva';
import DataTableBlock from '@/components/DataTableBlock';

const DistrictListComponent = (props) => {
  const { list, loading, dispatch } = props;

  const childRef = useRef();

  // table 表头
  const getColumns = [
    {
      title: '排名',
      fixed: 'left',
      dataIndex: 'userIdString',
    },
    {
      title: '区县名称',
      fixed: 'left',
      dataIndex: 'mobile',
    },
    {
      title: '营收金额',
      align: 'right',
      dataIndex: 'username',
      sorter: (a, b) => a.merchantCount - b.merchantCount,
    },
    {
      title: '注册用户数',
      align: 'right',
      dataIndex: 'residentAddress',
      sorter: (a, b) => a.merchantCount - b.merchantCount,
    },
    {
      title: '入驻店铺数',
      align: 'right',
      dataIndex: 'createTime',
      sorter: (a, b) => a.merchantCount - b.merchantCount,
    },
    {
      title: '激活店铺数',
      align: 'right',
      dataIndex: 'status',
      sorter: (a, b) => a.merchantCount - b.merchantCount,
    },
  ];

  return (
    <DataTableBlock
      CardNone={false}
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
}))(DistrictListComponent);
