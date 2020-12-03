import React, { useRef, useState, useEffect, lazy, Suspense } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import { BUSINESS_ACCOUNT_STATUS, BUSINESS_DO_STATUS, BUSINESS_STATUS } from '@/common/constant';
import CardLoading from '@/components/CardLoading';
import Ellipsis from '@/components/Ellipsis';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';
import BusinessDetailShow from './components/BusinessList/BusinessDetailShow';
import BusinessAdd from './components/BusinessList/BusinessEdit';
import BusinessQrCode from './components/BusinessList/BusinessQrCode';
import BusinessAwardSet from './components/BusinessList/BusinessAwardSet';
import BusinessEdit from './components/BusinessList/HubEdit';
import BusinessVerificationCodeSet from './components/BusinessList/BusinessVerificationCodeSet';

const BusinessTotalInfo = lazy(() => import('./components/BusinessList/BusinessTotalInfo'));

const BusinessListComponent = (props) => {
  const { businessList, tradeList, loading, dispatch } = props;

  const childRef = useRef();
  const [visible, setVisible] = useState({});
  const [visibleAdd, setVisibleAdd] = useState(false);
  const [visibleDetail, setVisibleDetail] = useState(false);
  const [visibleQrcode, setVisibleQrcode] = useState('');
  const [visibleEdit, setVisibleEdit] = useState('');

  // 搜索参数
  const searchItems = [
    {
      label: '店铺名称',
      name: 'merchantName',
    },
    {
      label: '店铺账号',
      name: 'account',
    },
    {
      label: '经营类目',
      name: 'topCategoryId',
      type: 'select',
      loading: loading.models.sysTradeList,
      select: { list: tradeList.map((item) => ({ name: item.categoryName, value: item.id })) },
    },
    {
      label: '账号状态',
      name: 'bankStatus',
      type: 'select',
      select: { list: BUSINESS_ACCOUNT_STATUS },
    },
    {
      label: '地址',
      type: 'city',
      name: 'city',
      changeOnSelect: true,
      valuesKey: ['provinceCode', 'cityCode', 'districtCode'],
    },
    {
      label: '经营状态',
      name: 'businessStatus',
      type: 'select',
      select: { list: BUSINESS_DO_STATUS },
    },
    {
      label: '店铺状态',
      name: 'status',
      type: 'select',
      select: { list: BUSINESS_STATUS },
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '店铺账号',
      fixed: 'left',
      dataIndex: 'account',
    },
    {
      title: '店铺名称',
      fixed: 'left',
      dataIndex: 'merchantName',
      render: (val) => (
        <Ellipsis length={10} tooltip>
          {val || '暂未授权'}
        </Ellipsis>
      ),
    },
    {
      title: '所在城市',
      align: 'center',
      dataIndex: 'cityName',
    },
    {
      title: '详细地址',
      align: 'right',
      dataIndex: 'address',
      render: (val) => (
        <Ellipsis length={10} tooltip>
          {val}
        </Ellipsis>
      ),
    },
    {
      label: '所属商圈',
      name: 'businessHub',
    },
    {
      title: '经营类目',
      align: 'center',
      dataIndex: 'topCategoryName',
      render: (val, row) => `${val} / ${row.categoryName}`,
    },
    {
      title: '入驻时间',
      align: 'center',
      dataIndex: 'settleTime',
      render: (val) => val || '--',
    },
    {
      title: '激活时间',
      align: 'center',
      dataIndex: 'activationTime',
      render: (val) => val || '--',
    },
    {
      title: '账号状态',
      align: 'center',
      dataIndex: 'bankStatus',
      render: (val) => (val === '3' ? '已激活' : '未激活'),
    },
    {
      title: '经营状态',
      align: 'center',
      dataIndex: 'businessStatus',
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
              title: '获取二维码',
              type: 'own',
              click: () => setVisibleQrcode(record),
            },
            {
              type: 'info',
              click: () => fetchGetDetail(val),
            },
            {
              type: 'edit',
              click: () => fetchGetDetail(val, (info) => setVisibleEdit({ show: true, info })),
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

  // 经营类目
  const fetchTradeList = () => {
    dispatch({
      type: 'sysTradeList/fetchGetList',
    });
  };

  // 获取商家详情
  const fetchGetDetail = (merchantId, callback) => {
    dispatch({
      type: 'businessList/fetchMerchantDetail',
      payload: { merchantId },
      callback: (info) => (callback ? callback(info) : handleShowUserDetail(info)),
    });
  };

  // 设置商家端登录验证码
  const handleVCodeSet = () => {
    dispatch({
      type: 'drawerForm/show',
      payload: BusinessVerificationCodeSet({ dispatch, childRef }),
    });
  };

  // 商户详情展示
  const handleShowUserDetail = (initialValues) => setVisibleDetail(initialValues);

  useEffect(() => {
    fetchTradeList();
  }, []);

  return (
    <>
      <DataTableBlock
        keepName="店铺数据"
        cRef={childRef}
        loading={
          loading.effects['businessList/fetchGetList'] ||
          loading.effects['businessList/fetchMerchantDetail']
        }
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.userMerchantIdString}`}
        dispatchType="businessList/fetchGetList"
        {...businessList}
      >
        <Suspense fallback={<CardLoading></CardLoading>}>
          <BusinessTotalInfo
            key="businessTotalInfo"
            btnExtra={
              <>
                <Button className="dkl_green_btn" key="1" onClick={() => setVisibleAdd(true)}>
                  新增商户
                </Button>
                <Button className="dkl_green_btn" key="1" onClick={handleVCodeSet}>
                  设置商家验证码
                </Button>
              </>
            }
          ></BusinessTotalInfo>
        </Suspense>
      </DataTableBlock>
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
      <BusinessEdit
        cRef={childRef}
        visible={visibleEdit}
        onClose={() => setVisibleEdit('')}
      ></BusinessEdit>
      <BusinessDetailShow
        cRef={childRef}
        visible={visibleDetail}
        onClose={() => setVisibleDetail(false)}
      ></BusinessDetailShow>
      <BusinessQrCode visible={visibleQrcode} onClose={() => setVisibleQrcode('')}></BusinessQrCode>
    </>
  );
};

export default connect(({ businessList, sysTradeList, loading }) => ({
  businessList,
  tradeList: sysTradeList.list.list,
  loading,
}))(BusinessListComponent);
