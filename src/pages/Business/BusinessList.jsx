import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import { BUSINESS_ACCOUNT_STATUS, BUSINESS_DO_STATUS, BUSINESS_STATUS } from '@/common/constant';
import Ellipsis from '@/components/Ellipsis';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';
import businessDetailShow from './components/BusinessList/BusinessDetailShow';
import BusinessTotalInfo from './components/BusinessList/BusinessTotalInfo';
import BusinessAdd from './components/BusinessList/BusinessAdd';
import BusinessAwardSet from './components/BusinessList/BusinessAwardSet';

const BusinessListComponent = (props) => {
  const { businessList, tradeList, loading, dispatch } = props;

  const childRef = useRef();
  const [visible, setVisible] = useState({});
  const [visibleAdd, setVisibleAdd] = useState(false);

  // 搜索参数
  const searchItems = [
    {
      label: '商户名称',
      name: 'merchantName',
    },
    {
      label: '商户账号',
      name: 'account',
    },
    {
      label: '商户类型',
      name: 'topCategoryId',
      type: 'select',
      loading: loading.models.sysTradeList,
      select: { list: tradeList.map((item) => ({ name: item.categoryName, value: item.id })) },
    },
    {
      label: '经营状态',
      name: 'status',
      type: 'select',
      select: { list: BUSINESS_DO_STATUS },
    },
    {
      label: '店铺状态',
      name: 'businessStatus',
      type: 'select',
      select: { list: BUSINESS_STATUS },
    },
    {
      label: '城市',
      type: 'city',
      name: 'city',
      changeOnSelect: true,
      valuesKey: ['provinceCode', 'cityCode', 'districtCode'],
    },
    {
      label: '抽佣比例',
      name: 'commissionRatio',
    },
    {
      label: '账号状态',
      name: 'status',
      type: 'select',
      select: { list: BUSINESS_ACCOUNT_STATUS },
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '商户账号',
      fixed: 'left',
      dataIndex: 'account',
    },
    {
      title: '商户简称',
      fixed: 'left',
      dataIndex: 'merchantName',
      render: (val) => val || '暂未授权',
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
          {val}
        </Ellipsis>
      ),
    },
    {
      title: '经营类目',
      align: 'center',
      dataIndex: 'categoryName',
      render: (val) => val || '-',
    },
    {
      title: '经营面积',
      align: 'center',
      dataIndex: 'businessArea',
      render: (val) => val || '--',
    },
    {
      title: '服务费',
      align: 'center',
      dataIndex: 'commissionRatio',
      render: (val) => `${val}%`,
    },
    {
      title: '账号状态',
      align: 'center',
      dataIndex: 'accountStatus',
      render: (val) => BUSINESS_ACCOUNT_STATUS[val],
    },
    {
      title: '经营状态',
      align: 'center',
      dataIndex: 'bankStatus',
      render: (val) => BUSINESS_DO_STATUS[val],
    },
    {
      title: '店铺状态',
      align: 'center',
      dataIndex: 'status',
      render: (val) => BUSINESS_STATUS[val],
    },
    {
      title: '操作',
      dataIndex: 'userMerchantIdString',
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

  // 品牌类型列表
  const fetchTradeList = () => {
    dispatch({
      type: 'sysTradeList/fetchGetList',
    });
  };

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
      payload: businessDetailShow({ dispatch, childRef, initialValues }),
    });
  };

  useEffect(() => {
    fetchTradeList();
  }, []);

  return (
    <>
      <BusinessTotalInfo
        btnExtra={
          <Button className="dkl_green_btn" key="1" onClick={() => setVisibleAdd(true)}>
            新增商户
          </Button>
        }
      ></BusinessTotalInfo>
      <DataTableBlock
        cRef={childRef}
        loading={loading.models.businessList}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.userMerchantIdString}`}
        dispatchType="businessList/fetchGetList"
        {...businessList}
      ></DataTableBlock>
      <BusinessAdd
        cRef={childRef}
        visible={visibleAdd}
        onClose={() => setVisibleAdd(false)}
      ></BusinessAdd>
      <BusinessAwardSet
        cRef={childRef}
        visible={visible}
        onClose={() => setVisible('')}
      ></BusinessAwardSet>
    </>
  );
};

export default connect(({ businessList, sysTradeList, loading }) => ({
  businessList,
  tradeList: sysTradeList.list.list,
  loading,
}))(BusinessListComponent);
