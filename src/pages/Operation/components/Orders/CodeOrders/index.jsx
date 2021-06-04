import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import debounce from 'lodash/debounce';
import TableDataBlock from '@/components/TableDataBlock';
import { ORDER_PAY_LOGO } from '@/common/constant';
import OrderDetailDraw from '../OrderDetailDraw';
import { Tag, Avatar } from 'antd';
import Ellipsis from '@/components/Ellipsis';

const CodeOrders = (props) => {
  const {
    ordersList,
    loading,
    dispatch,
    hubData,
    loadings,
    tabkey,
    merchantList,
    loadingMerchant,
    userList,
    loadingUser,
  } = props;
  const { list } = ordersList;

  const childRef = useRef();
  const [visible, setVisible] = useState(false);

  // 获取商圈
  const fetchGetHubSelect = (districtCode) => {
    dispatch({
      type: 'baseData/fetchGetHubData',
      payload: {
        districtCode,
      },
    });
  };

  // 搜索店铺
  const fetchClassifyGetMerchant = debounce((content) => {
    if (!content) return;
    dispatch({
      type: 'baseData/fetchGetMerchantsSearch',
      payload: {
        limit: 50,
        page: 1,
        content,
      },
    });
  }, 500);

  // 获取用户搜索
  const fetchGetUser = debounce((content) => {
    if (!content) return;
    dispatch({
      type: 'baseData/fetchGetUsersSearch',
      payload: {
        content,
      },
    });
  }, 500);

  //详情
  const fetchGoodsDetail = (index) => {
    const { orderId } = list[index];
    dispatch({
      type: 'ordersList/fetchOrderDetail',
      payload: { orderId },
      callback: (detail) => {
        setVisible({
          index,
          show: true,
          detail,
        });
      },
    });
  };

  // 搜索参数
  const searchItems = [
    {
      label: '订单号',
      name: 'orderSn',
    },
    {
      label: '下单人',
      name: 'userId',
      type: 'select',
      loading: loadingUser,
      placeholder: '请输入搜索用户昵称',
      select: userList,
      onSearch: (val) => fetchGetUser(val),
      fieldNames: { label: 'username', value: 'userIdString', tip: 'tipInfo' },
    },
    {
      label: '店铺/集团',
      name: 'merchantId',
      type: 'select',
      loading: loadingMerchant,
      placeholder: '请输入店铺/集团名称或账号',
      select: merchantList,
      onSearch: (val) => fetchClassifyGetMerchant(val),
    },
    {
      label: '商品名称',
      name: 'goodsName',
    },
    {
      label: '区域',
      name: 'city',
      type: 'cascader',
      changeOnSelect: true,
      valuesKey: ['provinceCode', 'cityCode', 'districtCode'],
      onChange: (val) => val.length === 3 && fetchGetHubSelect(val[2]),
    },
    // {
    //   label: '商圈',
    //   name: 'businessHubIdStr',
    //   type: 'select',
    //   loading: loadings.models.baseData,
    //   allItem: false,
    //   select: hubData,
    //   fieldNames: { label: 'businessHubName', value: 'businessHubIdString' },
    // },
    {
      label: '支付日期',
      type: 'rangePicker',
      name: 'orderTimeStart',
      end: 'orderTimeEnd',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '订单号',
      fixed: 'left',
      dataIndex: 'orderSn',
    },
    {
      title: '店铺',
      dataIndex: 'merchantName',
      render: (val, row) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div>账号:{row.merchantMobile}</div>
          <div style={{ display: 'flex', alignItems: 'center', margin: '5px 0' }}>
            <Tag color="magenta">单店</Tag>
            <Ellipsis length={10} tooltip>
              {val}
            </Ellipsis>
          </div>
          <div>{`${row.merchantProvince}-${row.merchantCity}-${row.merchantDistrict}`}</div>
        </div>
      ),
    },
    {
      title: '用户',
      align: 'center',
      dataIndex: 'userMobile',
      render: (val, row) => (
        <div style={{ textAlign: 'center' }}>
          <div>{row.userName}</div>
          <div>{val}</div>
          <div>{row.beanCode}</div>
        </div>
      ),
    },
    {
      title: '用户实付',
      align: 'center',
      dataIndex: 'payFee',
      render: (val, record) => {
        const cashBean = record.beanFee ? record.beanFee / 100 : 0;
        return (
          <div style={{ textAlign: 'center' }}>
            <div>{`￥${Number(val) + cashBean > 0 ? (Number(val) + cashBean).toFixed(2) : 0}`}</div>
            <div>{+record.beanFee ? `(${record.beanFee}卡豆` : '(' + '0卡豆'}</div>
            <div>{(val ? `+ ￥${val}` : 0) + ')'}</div>
          </div>
        );
      },
    },
    {
      title: '优惠券',
      align: 'center',
      dataIndex: 'reduceFee',
      render: (val) => (val ? `${val}元抵扣券` : '--'),
    },
    {
      title: '商户实收',
      align: 'center',
      dataIndex: 'actualCashFee',
      render: (val, record) => (
        <div style={{ textAlign: 'center' }}>
          <div>{`￥${
            (Number(val) + record.actualBeanFee ? record.actualBeanFee / 100 : 0)
              ? (Number(val) + record.actualBeanFee ? record.actualBeanFee / 100 : 0).toFixed(2)
              : 0
          }`}</div>
          <div>{+record.actualBeanFee ? `(${record.actualBeanFee}卡豆` : '(' + '0卡豆'}</div>
          <div>{(val ? `+ ￥${val}` : 0) + ')'}</div>
        </div>
      ),
    },
    {
      title: '商品佣金',
      align: 'center',
      dataIndex: 'cashCommission',
      render: (val, record) => (
        <div style={{ textAlign: 'center' }}>
          <div>{`￥${
            (Number(val) + record.beanCommission ? record.beanCommission / 100 : 0)
              ? (Number(val) + record.beanCommission ? record.beanCommission / 100 : 0).toFixed(2)
              : 0
          }`}</div>
          <div>{+record.beanCommission ? `(${record.beanCommission}卡豆` : '(' + '0卡豆'}</div>
          <div>{(val ? `+ ￥${val}` : 0) + ')'}</div>
        </div>
      ),
    },

    {
      title: '支付时间',
      align: 'center',
      dataIndex: 'createTime',
      render: (val, row) => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div>{val}</div>
          <Avatar src={ORDER_PAY_LOGO[row.orderSource]} size="small" shape="square" />
        </div>
      ),
    },
    {
      type: 'handle',
      dataIndex: 'orderId',
      render: (val, record, index) => [
        {
          type: 'info',
          click: () => fetchGoodsDetail(index),
        },
      ],
    },
  ];
  const extraBtn = ({ get }) => [
    {
      type: 'excel',
      dispatch: 'ordersList/fetchOrdersImport',
      data: { ...get(), goodsOrScanFlag: tabkey },
      exportProps: {
        header: getColumns.slice(0, -1),
        fieldRender: { merchantName: (val) => val },
      },
    },
  ];
  return (
    <>
      <TableDataBlock
        noCard={false}
        btnExtra={extraBtn}
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        params={{ goodsOrScanFlag: tabkey }}
        rowKey={(record) => `${record.orderSn}`}
        dispatchType="ordersList/fetchGetList"
        {...ordersList}
      ></TableDataBlock>
      <OrderDetailDraw
        visible={visible}
        total={list.length}
        onClose={() => setVisible(false)}
        getDetail={fetchGoodsDetail}
      ></OrderDetailDraw>
    </>
  );
};

export default connect(({ ordersList, baseData, loading }) => ({
  loadings: loading,
  ordersList,
  userList: baseData.userList,
  merchantList: baseData.merchantList,
  hubData: baseData.hubData,
  loading: loading.effects['ordersList/fetchGetList'],
  loadingUser: loading.effects['baseData/fetchGetUsersSearch'],
  loadingMerchant: loading.effects['baseData/fetchGetMerchantsSearch'],
}))(CodeOrders);
