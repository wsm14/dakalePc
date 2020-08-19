import React, { useRef } from 'react';
import { connect } from 'dva';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';
import BusinessTotalInfo from './components/Business/BusinessTotalInfo';

const AccountBusinessList = (props) => {
  const { accountBusiness, loading } = props;

  const childRef = useRef();

  // 搜索参数
  const searchItems = [
    {
      label: '商户名称',
      name: 'userMosbile1s',
    },
    {
      label: '商户帐号',
      name: 'userMobile1s',
    },
    {
      label: '手机号',
      name: 'usesrMobile1s',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '商户ID',
      dataIndex: 'userId',
    },
    {
      title: '商户名称',
      fixed: 'left',
      align: 'center',
      dataIndex: 'phoneNumber',
    },
    {
      title: '商户帐号',
      align: 'center',
      dataIndex: 'phoneNsumber',
    },
    {
      title: '累计收益（卡豆）',
      align: 'right',
      dataIndex: 'orderCount',
    },
    {
      title: '累计充值（卡豆）',
      align: 'right',
      dataIndex: 'orderTotal',
      render: (val) => `￥${val}`,
    },
    {
      title: '累计提现（卡豆）',
      align: 'right',
      dataIndex: 'parkName',
      render: (val) => val || '-',
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
              title: '提现记录',
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
      <BusinessTotalInfo></BusinessTotalInfo>
      <DataTableBlock
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.userId}`}
        dispatchType="accountBusiness/fetchGetList"
        {...accountBusiness}
      ></DataTableBlock>
    </>
  );
};

export default connect(({ accountBusiness, loading }) => ({
  accountBusiness,
  loading: loading.models.accountBusiness,
}))(AccountBusinessList);
