import React, { useRef, useState } from 'react';
import { connect } from 'dva';
import { ACCOUNT_STATUS, BUSINESS_STATUS } from '@/common/constant';
import { Button } from 'antd';
import Ellipsis from '@/components/Ellipsis';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';
import BusinessDetailShow from './components/BusinessList/BusinessDetailShow';
import BusinessTotalInfo from './components/BusinessList/BusinessTotalInfo';
import BusinessAwardSet from './components/BusinessList/BusinessAwardSet';

const BusinessListComponent = (props) => {
  const { businessList, loading, dispatch } = props;

  const childRef = useRef();
  const [visible, setVisible] = useState({});

  // 搜索参数
  const searchItems = [
    {
      label: '商户名称',
      name: 'merchantId',
    },
    {
      label: '商家账号',
      name: 'mobile',
    },
    {
      label: '商户类型',
      name: 'businessStsatus',
      type: 'select',
      select: { list: [] },
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
    {
      label: '城市',
      type: 'city',
      changeOnSelect: true,
      name: 'city',
    },
    {
      label: '抽佣比例',
      name: 'stssatus',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '商户ID',
      fixed: 'left',
      dataIndex: 'merchantId',
    },
    {
      title: '商户名称',
      fixed: 'left',
      dataIndex: 'merchantName',
      render: (val) => val || '暂未授权',
    },
    {
      title: '商户账号',
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
      render: (val) => (
        <Ellipsis length={10} tooltip>
          {val}
        </Ellipsis>
      ),
    },
    {
      title: '抽佣比例',
      align: 'right',
      dataIndex: 'addsress',
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
      fixed: 'right',
      align: 'right',
      render: (val, record) => (
        <HandleSetTable
          formItems={[
            {
              type: 'info',
              click: () => fetchGetDetail(record.merchantId),
            },
            {
              type: 'set',
              click: () => setVisible({ show: true, record }),
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

  // 商户详情展示
  const handleShowUserDetail = (initialValues) => {
    dispatch({
      type: 'drawerForm/show',
      payload: BusinessDetailShow({ dispatch, childRef, initialValues }),
    });
  };

  return (
    <>
      <BusinessTotalInfo
        btnExtra={
          <Button className="dkl_green_btn" key="1">
            新增商户
          </Button>
        }
      ></BusinessTotalInfo>
      <DataTableBlock
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.merchantId}`}
        dispatchType="businessList/fetchGetList"
        {...businessList}
      ></DataTableBlock>
      <BusinessAwardSet
        cRef={childRef}
        visible={visible}
        onClose={() => setVisible('')}
      ></BusinessAwardSet>
    </>
  );
};

export default connect(({ businessList, loading }) => ({
  businessList,
  loading: loading.models.businessList,
}))(BusinessListComponent);
