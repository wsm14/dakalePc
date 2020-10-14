import React, { useRef } from 'react';
import { connect } from 'dva';
import { Statistic, Card } from 'antd';
import DataTableBlock from '@/components/DataTableBlock';

const ExpertUserList = (props) => {
  const { list, loading, dispatch, userTotal } = props;

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
      dataIndex: 'follower',
    },
    {
      title: '关注数',
      align: 'center',
      dataIndex: 'attention',
    },
    {
      title: '获赞与被收藏',
      align: 'center',
      dataIndex: 'likeAmount',
      render: (val, record) => `${val} || ${record.collectionAmount}`,
    },
    {
      title: '推店数',
      align: 'center',
      dataIndex: 'merchantCount',
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
        哒人总数： <Statistic value={userTotal}></Statistic>
      </Card>
      <DataTableBlock
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.userIdString}`}
        NoSearch={true}
        dispatchType="userList/fetchGetList"
        {...list}
      ></DataTableBlock>
    </>
  );
};

export default connect(({ expertUserList, loading }) => ({
  ...expertUserList,
  loading: loading.models.expertUserList,
}))(ExpertUserList);
