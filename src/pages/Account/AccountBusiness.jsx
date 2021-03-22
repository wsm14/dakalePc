import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import HandleSetTable from '@/components/HandleSetTable';
import TableDataBlock from '@/components/TableDataBlock';
import BusinessDetailList from './components/Business/BusinessDetailList';
import BusinessTotalInfo from './components/Business/BusinessTotalInfo';

const AccountBusinessList = (props) => {
  const { list, loading, dispatch } = props;

  const [visible, setVisible] = useState('');

  // 搜索参数
  const searchItems = [
    {
      label: '店铺名称',
      name: 'merchantName',
    },
    {
      label: '店铺帐号',
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
      title: '店铺ID',
      fixed: 'left',
      dataIndex: 'userMerchantIdString',
    },
    {
      title: '店铺名称',
      align: 'center',
      dataIndex: 'merchantName',
    },
    {
      title: '集团名称',
      align: 'center',
      dataIndex: 'groupName',
      render: (val) => val || '--',
    },
    {
      title: '店铺帐号',
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
      render: (val) => val || '--',
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
              auth: 'peasDetail',
              title: '卡豆明细',
              click: () => setVisible({ type: 'peas', record }),
            },
            {
              auth: 'withdraw',
              title: '提现记录',
              click: () => setVisible({ type: 'collect', record }),
            },
            {
              auth: 'rechargeDetail',
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
      <BusinessTotalInfo></BusinessTotalInfo>
      <TableDataBlock
        keepData
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.userMerchantIdString}`}
        dispatchType="accountBusiness/fetchGetList"
        {...list}
      ></TableDataBlock>
      <BusinessDetailList visible={visible} setVisible={setVisible}></BusinessDetailList>
    </>
  );
};

export default connect(({ accountBusiness, loading }) => ({
  list: accountBusiness.list,
  loading: loading.effects['accountBusiness/fetchGetList'],
}))(AccountBusinessList);
