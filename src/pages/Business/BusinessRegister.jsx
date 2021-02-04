import React from 'react';
import { connect } from 'umi';
import { BUSINESS_REGISTER_STATUS } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';

const BusinessRegisterComponent = (props) => {
  const { businessRegister, loading } = props;

  // 搜索参数
  const searchItems = [
    {
      label: '注册手机号',
      name: 'mobile',
    },
    {
      label: '推荐人手机号',
      name: 'parentMobile',
    },
    {
      label: '状态',
      name: 'verifyAndBankStatus',
      type: 'select',
      select: { list: BUSINESS_REGISTER_STATUS },
    },
    {
      label: '省市区',
      type: 'cascader',
      name: 'city',
      changeOnSelect:true,
      valuesKey: ['provinceCode', 'cityCode', 'districtCode'],
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
    {
      title: '状态',
      align: 'center',
      dataIndex: 'verifyAndBankStatus',
      render: (val) => BUSINESS_REGISTER_STATUS[val],
    },
  ];

  return (
    <TableDataBlock
      keepName
      loading={loading}
      columns={getColumns}
      searchItems={searchItems}
      rowKey={(record) => `${record.userMerchantIdString}`}
      dispatchType="businessRegister/fetchGetList"
      {...businessRegister}
    ></TableDataBlock>
  );
};

export default connect(({ businessRegister, loading }) => ({
  businessRegister,
  loading: loading.models.businessRegister,
}))(BusinessRegisterComponent);
