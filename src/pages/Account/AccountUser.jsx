import React, { useRef } from 'react';
import { connect } from 'dva';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';
import UserTotalInfo from './components/User/UserTotalInfo';

const AccountUserList = (props) => {
  const { accountUser, loading } = props;

  const childRef = useRef();

  // 搜索参数
  const searchItems = [
    {
      label: '用户昵称',
      name: 'userMosbile1s',
    },
    {
      label: '手机号',
      name: 'userMobisle1s',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '用户ID',
      dataIndex: 'userId',
    },
    {
      title: '用户昵称',
      align: 'center',
      fixed: 'left',
      dataIndex: 'phoneNumber',
    },
    {
      title: '累计收益（卡豆）',
      align: 'right',
      dataIndex: 'orderCount',
    },
    {
      title: '累计充值',
      align: 'right',
      dataIndex: 'orderTotal',
      render: (val) => `￥${val}`,
    },
    {
      title: '累计支出（卡豆）',
      align: 'right',
      dataIndex: 'parkName',
      render: (val) => val || '-',
    },
    {
      title: '累计支出（金额）',
      align: 'right',
      dataIndex: 'addTimeStamp',
    },
    {
      title: '当前余额（卡豆）',
      align: 'right',
      dataIndex: 'addTimeStamp',
    },
    {
      title: '操作',
      dataIndex: 'id',
      fixed: 'right',
      align: 'right',
      render: (val, record) => (
        <HandleSetTable
          formItems={[
            {
              type: 'own',
              title: '卡豆明细',
              //   click: () => setShowCoach(record),
            },
            {
              type: 'own',
              title: '充值记录',
              //   click: () => setShowCoach(record),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <>
      <UserTotalInfo></UserTotalInfo>
      <DataTableBlock
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.userId}`}
        dispatchType="accountUser/fetchGetList"
        {...accountUser}
      ></DataTableBlock>
    </>
  );
};

export default connect(({ accountUser, loading }) => ({
  accountUser,
  loading: loading.models.accountUser,
}))(AccountUserList);
