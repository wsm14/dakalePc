import React, { useRef, useState } from 'react';
import { connect } from 'dva';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';
import { BUSINESS_STATUS_AUDIT } from '@/common/constant';
import BusinessAuditDetailShow from './components/BusinessAuditDetailShow';

const BusinessAuditList = (props) => {
  const { businessAuditList, loading, dispatch } = props;

  const childRef = useRef();

  // 搜索参数
  const searchItems = [
    {
      label: '商家名称',
      name: 'merchantName',
    },
    {
      label: '商家账号',
      name: 'mobile',
    },
    {
      label: '审核状态',
      name: 'verifyStatus',
      type: 'select',
      select: { list: BUSINESS_STATUS_AUDIT },
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '商家名称',
      dataIndex: 'merchantName',
    },
    {
      title: '商家账号',
      align: 'center',
      dataIndex: 'mobile',
      render: (val) => val || '暂未授权',
    },
    {
      title: '商家类型',
      align: 'center',
      dataIndex: 'topCategoryName',
      render: (val) => val || '-',
    },
    {
      title: '所在城市',
      align: 'center',
      dataIndex: 'cityName',
    },
    {
      title: '详细地址',
      align: 'center',
      dataIndex: 'address',
      render: (val) => val || '-',
    },
    {
      title: '申请时间',
      align: 'center',
      dataIndex: 'applyTime',
    },
    {
      title: '审核时间',
      align: 'center',
      dataIndex: 'applyTime',
      render: (val) => val || '-',
    },
    {
      title: '审核状态',
      align: 'center',
      dataIndex: 'verifyStatus',
      render: (val) => BUSINESS_STATUS_AUDIT[val],
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
              type: 'check',
              visible: record.verifyStatus === '1',
              click: () => fetchGetDetail(record.userMerchantVerifyId),
            },
          ]}
        />
      ),
    },
  ];

  // 获取商家详情
  const fetchGetDetail = (userMerchantVerifyId) => {
    dispatch({
      type: 'businessAuditList/fetchMerchantAuditDetail',
      payload: { userMerchantVerifyId },
      callback: (val) => handleShowUserDetail(val, userMerchantVerifyId),
    });
  };

  // 用户详情展示
  const handleShowUserDetail = (initialValues, mreId) => {
    dispatch({
      type: 'drawerForm/show',
      payload: BusinessAuditDetailShow({ dispatch, childRef, initialValues, mreId, loading }),
    });
  };

  return (
    <DataTableBlock
      cRef={childRef}
      loading={loading}
      columns={getColumns}
      searchItems={searchItems}
      rowKey={(record) => `${record.userMerchantVerifyId}`}
      dispatchType="businessAuditList/fetchGetList"
      {...businessAuditList}
    ></DataTableBlock>
  );
};

export default connect(({ businessAuditList, loading }) => ({
  businessAuditList,
  loading: loading.models.businessAuditList,
}))(BusinessAuditList);
