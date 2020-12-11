import React, { useRef, useState, useEffect, lazy, Suspense } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import { BUSINESS_ACCOUNT_STATUS, BUSINESS_DO_STATUS, BUSINESS_STATUS } from '@/common/constant';
import exportExcel from '@/utils/exportExcel';
import CardLoading from '@/components/CardLoading';
import Ellipsis from '@/components/Ellipsis';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';
import BusinessDetailShow from './components/BusinessList/BusinessDetailShow';
import BusinessQrCode from './components/BusinessList/BusinessQrCode';
import BusinessAwardSet from './components/BusinessList/BusinessAwardSet';
import BusinessEdit from './components/BusinessList/BusinessEdit';
import BusinessVerificationCodeSet from './components/BusinessList/BusinessVerificationCodeSet';

const BusinessTotalInfo = lazy(() => import('./components/BusinessList/BusinessTotalInfo'));

const BusinessListComponent = (props) => {
  const { businessList, tradeList, loading, dispatch } = props;

  const childRef = useRef();
  const [visible, setVisible] = useState({});
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
      type: 'cascader',
      name: 'topCategoryId',
      changeOnSelect: true,
      options: tradeList,
      fieldNames: { label: 'categoryName', value: 'categoryIdString', children: 'categoryDTOList' },
      valuesKey: ['topCategoryId', 'categoryId'],
      placeholder: '选择经营类目',
    },
    {
      label: '账号状态',
      name: 'bankStatus',
      type: 'select',
      select: { list: BUSINESS_ACCOUNT_STATUS },
    },
    {
      label: '集团名称',
      name: 'groupName',
    },
    {
      label: '店铺类型',
      name: 'groupFlag',
      type: 'select',
      select: { list: ['单店', '集团'] },
    },
    {
      label: '地址',
      name: 'city',
      type: 'cascader',
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
      title: '店铺类型',
      align: 'center',
      dataIndex: 'groupId',
      render: (val) => (val ? '集团' : '单店'),
    },
    {
      title: '集团名称',
      dataIndex: 'groupName',
      render: (val) => val || '--',
    },
    {
      title: '联系人手机号',
      align: 'center',
      dataIndex: 'activatisonTime',
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
              click: () =>
                fetchGetDetail(val, (info) => setVisibleEdit({ show: true, type: 'edit', info })),
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

  // 获取商家导出excel 数据
  const fetchGetExcel = (payload) => {
    const fieldNames = { key: 'key', headerName: 'header' };
    const header = [
      { key: 'account', header: '店铺账号' },
      { key: 'merchantName', header: '店铺简称' },
      { key: 'cityName', header: '所在城市' },
      { key: 'address', header: '详细地址' },
      { key: 'topCategoryName', header: '一级经营类目' },
      { key: 'categoryName', header: '二级经营类目' },
      { key: 'businessArea', header: '经营面积' },
      { key: 'commissionRatio', header: '服务费', render: (val) => (val ? `${val}%` : '') },
      { key: 'settleTime', header: '入驻时间' },
      { key: 'activationTime', header: '激活时间' },
      {
        key: 'bankStatus',
        header: '账号状态',
        render: (val) => (val === '3' ? '已激活' : '未激活'),
      },
      { key: 'businessStatus', header: '经营状态', render: (val) => BUSINESS_DO_STATUS[val] },
      { key: 'status', header: '店铺状态', render: (val) => BUSINESS_STATUS[val] },
    ];
    dispatch({
      type: 'businessList/fetchMerchantGetExcel',
      payload,
      callback: (data) => exportExcel({ header, data, fieldNames }),
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
        btnExtra={({ get }) => (
          <Button className="dkl_green_btn" key="1" onClick={() => fetchGetExcel(get())}>
            导出
          </Button>
        )}
        cRef={childRef}
        loading={
          loading.effects['businessList/fetchGetList'] ||
          loading.effects['businessList/fetchMerchantDetail'] ||
          loading.effects['businessList/fetchMerchantGetExcel']
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
                <Button
                  className="dkl_green_btn"
                  key="1"
                  onClick={() => setVisibleEdit({ type: 'add', show: true, info: false })}
                >
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
      <BusinessAwardSet
        cRef={childRef}
        visible={visible}
        onClose={() => setVisible('')}
      ></BusinessAwardSet>
      <BusinessEdit
        cRef={childRef}
        visible={visibleEdit}
        initialValues={visibleEdit.info}
        onClose={() => setVisibleEdit(false)}
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
