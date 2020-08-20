import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';
import BusinessTotalInfo from './components/Business/BusinessTotalInfo';
import BusinessDetailList from './components/Business/BusinessDetailList';

const AccountBusinessList = (props) => {
  const { list, loading, dispatch } = props;

  const [visible, setVisible] = useState('');

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
      type: 'accountUser/clearDetail',
    });
  }, [visible]);

  return (
    <>
      <BusinessTotalInfo></BusinessTotalInfo>
      <DataTableBlock
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.userId}`}
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
