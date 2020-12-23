import React, { useRef } from 'react';
import { connect } from 'dva';
import DataTableBlock from '@/components/DataTableBlock';

const BusinessSettled = (props) => {
  const { businessSettled, loading } = props;

  const childRef = useRef();

  // 搜索参数
  const searchItems = [
    {
      label: '提审时间',
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
      title: '提交审核时间',
      align: 'center',
      dataIndex: 'createTime',
      render: (val) => val || '--',
    },
    {
      title: '审核状态',
      align: 'center',
      dataIndex: 'STATUS',
      render: (val) => val || '--',
    },
  ];

  return (
    <DataTableBlock
      keepName="入驻查询"
      cRef={childRef}
      loading={loading}
      columns={getColumns}
      searchItems={searchItems}
      rowKey={(record) => `${record.id}`}
      dispatchType="businessSettled/fetchGetList"
      {...businessSettled}
    ></DataTableBlock>
  );
};

export default connect(({ businessSettled, loading }) => ({
  businessSettled,
  loading: loading.effects['businessSettled/fetchGetList'],
}))(BusinessSettled);
