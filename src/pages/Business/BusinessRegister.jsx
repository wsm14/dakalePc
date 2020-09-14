import React from 'react';
import { connect } from 'dva';
import DataTableBlock from '@/components/DataTableBlock';

const BusinessRegisterComponent = (props) => {
  const { businessRegister, loading } = props;

  // 搜索参数
  const searchItems = [
    {
      label: '注册手机号',
      name: 'mobile',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '注册手机号',
      align: 'center',
      dataIndex: 'mobile',
    },
    {
      title: '推荐人手机号',
      align: 'center',
      dataIndex: 'parentMobile',
      render: (val) => val || '--',
    },
    {
      title: '注册时间',
      align: 'center',
      dataIndex: 'createTime',
    },
  ];

  return (
    <DataTableBlock
      loading={loading}
      columns={getColumns}
      searchItems={searchItems}
      rowKey={(record) => `${record.userMerchantIdString}`}
      dispatchType="businessRegister/fetchGetList"
      {...businessRegister}
    ></DataTableBlock>
  );
};

export default connect(({ businessRegister, loading }) => ({
  businessRegister,
  loading: loading.models.businessRegister,
}))(BusinessRegisterComponent);
