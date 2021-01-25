import React, { useRef } from 'react';
import { connect } from 'umi';
import DataTableBlock from '@/components/DataTableBlock';
import IncomeOrderDetail from '../Detail/IncomeOrderDetail';

const OrderList = (props) => {
  const { withdrawDetail, loading } = props;

  const childRef = useRef();

  // table 表头
  const getColumns = [
    {
      title: '序号',
      fixed: 'left',
      dataIndex: 'merchantBeanWithdrawalId',
      render: (val, row, index) => index + 1,
    },
    {
      title: '时间',
      align: 'center',
      dataIndex: 'withdrawalDate',
    },
    {
      title: '项目',
      align: 'center',
      dataIndex: 'withdrawalSn',
    },
    {
      title: '卡豆',
      align: 'right',
      dataIndex: 'merchantName',
    },
    {
      title: '详情',
      align: 'right',
      dataIndex: 'remark',
      render: (val, record) => <IncomeOrderDetail></IncomeOrderDetail>,
    },
  ];

  return (
    <DataTableBlock
      noCard={false}
      cRef={childRef}
      loading={loading.effects['withdrawDetail/fetchGetList']}
      columns={getColumns}
      rowKey={(record) => `${record.merchantBeanWithdrawalId}`}
      dispatchType="withdrawDetail/fetchGetList"
      {...withdrawDetail.list}
      list={[1]}
    ></DataTableBlock>
  );
};

export default connect(({ withdrawDetail, loading }) => ({
  withdrawDetail,
  loading,
}))(OrderList);
