import React from 'react';
import { connect } from 'dva';
import DataTableBlock from '@/components/DataTableBlock';

const BusinessRegisterComponent = (props) => {
  const { businessRegister, loading } = props;

  // 搜索参数
  const searchItems = [
    {
      label: '注册手机号',
      name: 'brandName',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '注册手机号',
      align: 'center',
      dataIndex: 'brandLogo',
    },
    {
      title: '推荐人手机号',
      align: 'center',
      dataIndex: 'brandName',
    },
    {
      title: '注册时间',
      align: 'center',
      dataIndex: 'categoryName',
    },
  ];

  return (
    <DataTableBlock
      loading={loading}
      columns={getColumns}
      searchItems={searchItems}
      rowKey={(record) => `${record.id}`}
      dispatchType="businessRegister/fetchGetList"
      {...businessRegister}
    ></DataTableBlock>
  );
};

export default connect(({ businessRegister, loading }) => ({
  businessRegister,
  loading: loading.models.businessRegister,
}))(BusinessRegisterComponent);
