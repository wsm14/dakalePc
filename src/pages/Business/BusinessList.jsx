import React, { useRef } from 'react';
import { connect } from 'dva';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';
import { ACCOUNT_STATUS, BUSINESS_STATUS } from '@/common/constant';
import BusinessDetailShow from './components/BusinessDetailShow';

const BusinessListComponent = (props) => {
  const { businessList, loading, dispatch } = props;

  const childRef = useRef();

  // 搜索参数
  const searchItems = [
    {
      label: '商户ID',
      name: 'merchantId',
    },
    {
      label: '商家账号',
      name: 'mobile',
    },
    {
      label: '经营状态',
      name: 'businessStatus',
      type: 'select',
      select: { list: BUSINESS_STATUS },
    },
    {
      label: '店铺状态',
      name: 'status',
      type: 'select',
      select: { list: ACCOUNT_STATUS },
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '商户ID',
      dataIndex: 'merchantId',
    },
    {
      title: '商家名称',
      align: 'center',
      dataIndex: 'merchantName',
      render: (val) => val || '暂未授权',
    },
    {
      title: '商家账号',
      align: 'center',
      dataIndex: 'mobile',
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
      render: (val) => val || '-',
    },
    {
      title: '详细地址',
      align: 'center',
      dataIndex: 'address',
    },
    {
      title: '经营状态',
      align: 'center',
      dataIndex: 'businessStatus',
      render: (val) => BUSINESS_STATUS[val],
    },
    {
      title: '店铺状态',
      align: 'center',
      dataIndex: 'status',
      render: (val) => ACCOUNT_STATUS[val],
    },
    {
      title: '操作',
      dataIndex: 'id',
      align: 'center',
      render: (val, record) => (
        <HandleSetTable
          formItems={[
            {
              type: 'info',
              click: () => fetchGetDetail(record.merchantId),
            },
          ]}
        />
      ),
    },
  ];

  // 获取商家详情
  const fetchGetDetail = (merchantId) => {
    dispatch({
      type: 'businessList/fetchMerchantDetail',
      payload: { merchantId },
      callback: handleShowUserDetail,
    });
  };

  // 用户详情展示
  const handleShowUserDetail = (initialValues) => {
    dispatch({
      type: 'drawerForm/show',
      payload: BusinessDetailShow({ dispatch, childRef, initialValues }),
    });
  };

  return (
    <DataTableBlock
      cRef={childRef}
      loading={loading}
      columns={getColumns}
      searchItems={searchItems}
      rowKey={(record) => `${record.merchantId}`}
      dispatchType="businessList/fetchGetList"
      {...businessList}
    ></DataTableBlock>
  );
};

export default connect(({ businessList, loading }) => ({
  businessList,
  loading: loading.models.businessList,
}))(BusinessListComponent);
