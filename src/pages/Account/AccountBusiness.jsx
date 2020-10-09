import React, { useState, useEffect, lazy, Suspense } from 'react';
import { connect } from 'dva';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';
import CardLoading from '@/components/CardLoading';
import BusinessDetailList from './components/Business/BusinessDetailList';

const BusinessTotalInfo = lazy(() => import('./components/Business/BusinessTotalInfo'));

const AccountBusinessList = (props) => {
  const { list, loading, dispatch } = props;

  const [visible, setVisible] = useState('');

  // 搜索参数
  const searchItems = [
    {
      label: '商户名称',
      name: 'merchantName',
    },
    {
      label: '商户帐号',
      name: 'account',
    },
    {
      label: '手机号',
      name: 'mobile',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '商户ID',
      fixed: 'left',
      dataIndex: 'userMerchantIdString',
    },
    {
      title: '商户名称',
      align: 'center',
      dataIndex: 'merchantName',
    },
    {
      title: '商户帐号',
      align: 'center',
      dataIndex: 'account',
    },
    {
      title: '累计收益（卡豆）',
      align: 'right',
      dataIndex: 'totalAdd',
    },
    {
      title: '累计充值（卡豆）',
      align: 'right',
      dataIndex: 'totalCharge',
    },
    {
      title: '累计提现（卡豆）',
      align: 'right',
      dataIndex: 'totalConsume',
      render: (val) => val || '-',
    },
    {
      title: '当前余额（卡豆）',
      align: 'right',
      dataIndex: 'bean',
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
              click: () => setVisible({ type: 'peas', record }),
            },
            {
              type: 'own',
              title: '提现记录',
              click: () => setVisible({ type: 'collect', record }),
            },
            {
              type: 'own',
              title: '充值记录',
              click: () => setVisible({ type: 'recharge', record }),
            },
          ]}
        />
      ),
    },
  ];

  useEffect(() => {
    dispatch({
      type: 'accountBusiness/clearDetail',
    });
  }, [visible]);

  return (
    <>
      <Suspense fallback={<CardLoading></CardLoading>}>
        <BusinessTotalInfo></BusinessTotalInfo>
      </Suspense>
      <DataTableBlock
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.userMerchantIdString}`}
        dispatchType="accountBusiness/fetchGetList"
        {...list}
      ></DataTableBlock>
      <BusinessDetailList visible={visible} setVisible={setVisible}></BusinessDetailList>
    </>
  );
};

export default connect(({ accountBusiness, loading }) => ({
  list: accountBusiness.list,
  loading: loading.effects['accountBusiness/fetchGetList'],
}))(AccountBusinessList);
