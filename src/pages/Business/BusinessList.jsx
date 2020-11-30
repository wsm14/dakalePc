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
      name: 'bankStatus',
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
      label: '所属商圈',
      name: 'businessHub',
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
              type: 'edit',
              click: () => fetchGetDetail(val, (info) => setVisibleEdit({ show: true, info })),
            },
            {
              type: 'info',
              click: () => fetchGetDetail(val),
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
  // fetchMerchantEdit

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
        keepName="商户数据"
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
                {/* <Button className="dkl_green_btn" key="1" onClick={() => setVisibleAdd(true)}>
                  新增商户
                </Button> */}
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
