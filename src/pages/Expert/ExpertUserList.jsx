import React, { useRef } from 'react';
import { connect } from 'dva';
import { Statistic, Card } from 'antd';
import DataTableBlock from '@/components/DataTableBlock';

const ExpertUserList = (props) => {
  const { list, loading, dispatch } = props;

  const childRef = useRef();

  // 搜索参数
  const searchItems = [
    {
      label: '手机号',
      name: 'mobile',
    },
    {
      label: '哒人号',
      name: 'mobiles',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '哒人号',
      fixed: 'left',
      dataIndex: 'userIdString',
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
    },
    {
      title: '发布分享',
      align: 'left',
      dataIndex: 'username',
    },
    {
      title: '粉丝数',
      align: 'center',
      dataIndex: 'gender',
      render: (val) => ({ M: '男', F: '女', '': '--' }[val]),
    },
    {
      title: '关注数',
      align: 'center',
      dataIndex: 'realNameStatus',
    },
    {
      title: '获赞与被收藏',
      align: 'center',
      dataIndex: 'residentAddress',
      render: (val) => val || '-',
    },
    {
      title: '推店数',
      align: 'center',
      dataIndex: 'createTime',
    },
    {
      title: '解锁时间',
      align: 'center',
      dataIndex: 'status',
      render: (val) => ACCOUNT_STATUS[val],
    },
  ];

  return (
    <>
      <Card
        style={{ marginBottom: 16 }}
        bodyStyle={{ display: 'flex', alignItems: 'center', padding: '10px 24px' }}
      >
        哒人总数： <Statistic value={1000}></Statistic>
      </Card>
      <DataTableBlock
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.userIdString}`}
        NoSearch={true}
        dispatchType="userList/fetchGetList"
        list={list}
      ></DataTableBlock>
    </>
  );
};

export default connect(({ userList, loading }) => ({
  list: userList.list,
  loading: loading.effects['userList/fetchGetList'],
}))(ExpertUserList);
