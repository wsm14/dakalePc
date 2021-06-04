import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { Tag, Badge, Avatar } from 'antd';
import {
  ORDERS_STATUS,
  ORDERS_TYPE,
  ORDER_CLOSE_TYPE,
  ORDER_TYPE_PROPS,
  ORDER_PAY_LOGO,
  GOODS_CLASS_TYPE,
} from '@/common/constant';
import debounce from 'lodash/debounce';
import TableDataBlock from '@/components/TableDataBlock';
import OrderDetailDraw from '../OrderDetailDraw';
import PopImgShow from '@/components/PopImgShow';
import Ellipsis from '@/components/Ellipsis';
import coupon from '../../../img/coupon.png';

const GoodsOrders = (props) => {
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

  const [visible, setVisible] = useState(false);

  const childRef = useRef();

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
      label: '商品名称',
      name: 'goodsName',
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
      label: '订单属性',
      type: 'select',
      name: 'orderType',
      select: ORDERS_TYPE,
    },
    {
      label: '状态',
      name: 'status',
      type: 'select',
      select: ORDERS_STATUS,
    },
    // {
    //   label: '订单关闭类型',
    //   name: 'closeType',
    //   type: 'select',
    //   select: ORDER_CLOSE_TYPE,
    // },
    {
      label: '下单日期',
      type: 'rangePicker',
      name: 'orderTimeStart',
      end: 'orderTimeEnd',
    },
    {
      label: '核销日期',
      type: 'rangePicker',
      name: 'verificationTimeStart',
      end: 'verificationTimeEnd',
    },
    {
      label: '区域',
      name: 'city',
      type: 'cascader',
      changeOnSelect: true,
      valuesKey: ['provinceCode', 'cityCode', 'districtCode'],
      onChange: (val) => val.length === 3 && fetchGetHubSelect(val[2]),
    },
    {
      label: '商圈',
      name: 'businessHubIdStr',
      type: 'select',
      loading: loadings.models.baseData,
      allItem: false,
      select: hubData,
      fieldNames: { label: 'businessHubName', value: 'businessHubIdString' },
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '商品',
      dataIndex: 'goodsImg',
      render: (val, row) => (
        <div style={{ display: 'flex' }}>
          <div>
            <Badge.Ribbon text={ORDER_TYPE_PROPS[row.orderType]} color="cyan" placement="start">
              <PopImgShow
                url={row.goodsImg || coupon}
                onClick={row.goodsImg ? null : () => {}}
              ></PopImgShow>
            </Badge.Ribbon>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 5 }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {row.goodsType && row.goodsType !== 'reduce' && (
                <Tag color="magenta">{GOODS_CLASS_TYPE[row.goodsType]}</Tag>
              )}
              <Ellipsis length={10} tooltip>
                {row.goodsName}
              </Ellipsis>
            </div>

            <div style={{ marginTop: 5 }}>订单号：{row.orderSn}</div>
          </div>
        </div>
      ),
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
      title: '下单人',
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
      title: '价格/数量',
      dataIndex: 'realPrice',
      render: (val, row) => (
        <div style={{ textAlign: 'center' }}>
          {/* <div style={{ textDecoration: 'line-through', color: '#999' }}>
            {val ? `￥${val}` : 0}
          </div> */}
          <div>{val ? `￥${val}` : 0}</div>
          <div>{row.goodsCount ? `×${row.goodsCount}` : ''}</div>
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
      title: '下单/核销时间',
      dataIndex: 'createTime',
      align: 'center',
      render: (val, row) => (
        <div style={{ textAlign: 'center' }}>
          <div>{val}</div>
          <div>已核销：{row.verificationCount}</div>
          <div>{row.verificationTime}</div>
        </div>
      ),
    },
    {
      title: '状态',
      align: 'center',
      dataIndex: 'status',
      render: (val, row) => (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 5 }}>
            {ORDERS_STATUS[val]}
            <Avatar
              src={ORDER_PAY_LOGO[row.orderSource]}
              size="small"
              shape="square"
              style={{ marginLeft: 5 }}
            />
          </div>
          <span style={{ color: '#999' }}>{ORDER_CLOSE_TYPE[row.closeType]}</span>
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
        fieldRender: { merchantName: (val) => val, goodsName: (val) => val },
      },
    },
  ];

  return (
    <>
      <TableDataBlock
        btnExtra={extraBtn}
        noCard={false}
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        params={{ goodsOrScanFlag: tabkey }}
        rowKey={(record) => `${record.orderId}`}
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
}))(GoodsOrders);
