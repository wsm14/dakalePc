import React, { useRef } from 'react';
import { connect } from 'dva';
import { BUSINESS_STATUS_AUDIT } from '@/common/constant';
import Ellipsis from '@/components/Ellipsis';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';
import businessAuditDetailShow from './components/Audit/BusinessAuditDetailShow';

const BusinessAuditList = (props) => {
  const { businessAudit, loading, dispatch } = props;

  const childRef = useRef();

  // 搜索参数
  const searchItems = [
    {
      label: '商户简称',
      name: 'merchantName',
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
      title: '商家账号',
      fixed: 'left',
      dataIndex: 'account',
      render: (val) => val || '暂未授权',
    },
    {
      title: '商户简称',
      fixed: 'left',
      dataIndex: 'merchantName',
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
      render: (val) => (
        <Ellipsis length={10} tooltip>
          {val || '--'}
        </Ellipsis>
      ),
    },
    {
      title: '经营类目',
      align: 'center',
      dataIndex: 'topCategoryName',
      render: (val, row) => `${val}${row.categoryName}`,
    },
    {
      title: '经营面积',
      align: 'right',
      dataIndex: 'businessArea',
      render: (val) => val || '--',
    },
    {
      title: '服务费',
      align: 'right',
      dataIndex: 'commissionRatio',
      render: (val, row) => `${val}%（赠送${row.bondBean}卡豆）`,
    },
    {
      title: '申请时间',
      align: 'center',
      dataIndex: 'applyTime',
    },
    {
      title: '审核时间',
      align: 'center',
      dataIndex: 'verifyTime',
      render: (val) => val || '--',
    },
    {
      title: '审核状态',
      align: 'center',
      dataIndex: 'verifyStatus',
      render: (val) => BUSINESS_STATUS_AUDIT[val],
    },
    {
      title: '操作',
      dataIndex: 'userMerchantVerifyId',
      align: 'right',
      fixed: 'right',
      render: (val, record) => (
        <HandleSetTable
          formItems={[
            {
              type: 'check',
              visible: record.verifyStatus === '1',
              click: () => fetchGetDetail(val),
            },
            {
              type: 'eye',
              visible: record.verifyStatus === '2',
              click: () => handleShowUserDetail(record),
            },
          ]}
        />
      ),
    },
  ];

  // 获取商家详情
  const fetchGetDetail = (userMerchantVerifyId) => {
    dispatch({
      type: 'businessAudit/fetchMerchantAuditDetail',
      payload: { userMerchantVerifyId },
      callback: (val) => handleShowUserDetail(val, userMerchantVerifyId),
    });
  };

  // 用户详情展示
  const handleShowUserDetail = (initialValues, mreId) => {
    dispatch({
      type: 'drawerForm/show',
      payload: businessAuditDetailShow({ dispatch, childRef, initialValues, mreId }),
    });
  };

  return (
    <DataTableBlock
      cRef={childRef}
      loading={loading}
      columns={getColumns}
      searchItems={searchItems}
      rowKey={(record) => `${record.userMerchantVerifyId}`}
      dispatchType="businessAudit/fetchGetList"
      {...businessAudit}
    ></DataTableBlock>
  );
};

export default connect(({ businessAudit, loading }) => ({
  businessAudit,
  loading: loading.models.businessAudit,
}))(BusinessAuditList);
