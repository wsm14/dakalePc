import React, { useRef } from 'react';
import { connect } from 'dva';
import DataTableBlock from '@/components/DataTableBlock';

const BusinessBindBank = (props) => {
  const { businessBindBank, loading } = props;

  const childRef = useRef();

  // 搜索参数
  const searchItems = [
    {
      label: '绑卡时间',
      type: 'rangePicker',
      name: 'beginDate',
      end: 'endDate',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: 'ID',
      fixed: 'left',
      dataIndex: 'id',
    },
    {
      title: '商家名称',
      align: 'center',
      dataIndex: 'merchantName',
      render: (val) => val || '--',
    },
    {
      title: '推店人名称',
      align: 'center',
      dataIndex: 'username',
      render: (val) => val || '--',
    },
    {
      title: '推店人手机',
      align: 'center',
      dataIndex: 'mobile',
      render: (val) => val || '--',
    },
    {
      title: '绑定银行卡时间',
      align: 'center',
      dataIndex: 'updateTime',
      render: (val) => val || '--',
    },
    {
      title: '审核通过时间',
      align: 'center',
      dataIndex: 'verifyTime',
      render: (val) => val || '--',
    },
  ];

  return (
    <DataTableBlock
      keepName="绑定查询"
      cRef={childRef}
      loading={loading}
      columns={getColumns}
      searchItems={searchItems}
      rowKey={(record) => `${record.id}`}
      dispatchType="businessBindBank/fetchGetList"
      {...businessBindBank}
    ></DataTableBlock>
  );
};

export default connect(({ businessBindBank, loading }) => ({
  businessBindBank,
  loading: loading.effects['businessBindBank/fetchGetList'],
}))(BusinessBindBank);
