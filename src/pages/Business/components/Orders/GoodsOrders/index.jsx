import React, { useRef } from 'react';
import { connect } from 'dva';
import { ORDERS_STATUS, ORDERS_TYPE, PAY_TYPE } from '@/common/constant';
import DataTableBlock from '@/components/DataTableBlock';
import OrdersDetail from '../OrdersDetail';

const GoodsOrders = (props) => {
  const { ordersList, loading, dispatch, hubData, loadings, tabkey } = props;

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

  // 搜索参数
  const searchItems = [
    {
      label: '订单号',
      name: 'orderSn',
    },
    {
      label: '手机号',
      name: 'mobile',
    },
    {
      label: '店铺名',
      name: 'merchantName',
    },
    {
      label: '订单属性',
      type: 'select',
      name: 'orderType',
      select: {
        list: ORDERS_TYPE,
      },
    },
    {
      label: '状态',
      name: 'status',
      type: 'select',
      select: {
        list: ORDERS_STATUS,
      },
    },
    {
      label: '区域',
      name: 'city',
      type: 'cascader',
      valuesKey: ['provinceCode', 'cityCode', 'districtCode'],
      onChange: (val) => val.length && fetchGetHubSelect(val[2]),
    },
    {
      label: '商圈',
      name: 'businessHubIdStr',
      type: 'select',
      loading: loadings.models.baseData,
      allItem: false,
      select: {
        list: hubData.map((item) => ({
          name: item.businessHubName,
          value: item.businessHubIdString,
        })),
      },
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
      title: '手机号',
      fixed: 'left',
      dataIndex: 'mobile',
    },
    {
      title: '购买商品',
      dataIndex: 'goodsName',
    },
    {
      title: '购买数量',
      align: 'right',
      dataIndex: 'goodsCount',
    },
    {
      title: '卡豆抵扣',
      align: 'right',
      dataIndex: 'beanFee',
      render: (val) => val / 100,
    },
    {
      title: '现金支付',
      align: 'right',
      dataIndex: 'payFee',
      render: (val, record) =>
        `${val || 0}${record.payType ? '（' + PAY_TYPE[record.payType] + '）' : ''}`,
    },
    {
      title: '优惠券',
      dataIndex: 'businessArea',
      render: (val) => `--`,
    },
    {
      title: '下单日期',
      align: 'center',
      dataIndex: 'createTime',
    },
    {
      title: '店铺名称',
      align: 'center',
      dataIndex: 'merchantName',
    },
    {
      title: '订单属性',
      align: 'center',
      dataIndex: 'orderType',
      render: (val) => {
        const type = ORDERS_TYPE.filter((i) => i.value == val);
        return type.length ? type[0].name : '--';
      },
    },
    {
      title: '状态',
      align: 'center',
      dataIndex: 'status',
      render: (val) => ORDERS_STATUS[val],
    },
    {
      title: '操作',
      dataIndex: 'orderId',
      align: 'right',
      fixed: 'right',
      render: (val, record) => <OrdersDetail order={val} name={record.goodsName}></OrdersDetail>,
    },
  ];

  return (
    <>
      <DataTableBlock
        CardNone={false}
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        params={{ goodsOrScanFlag: tabkey }}
        rowKey={(record) => `${record.orderSn}`}
        dispatchType="ordersList/fetchGetList"
        {...ordersList}
      ></DataTableBlock>
    </>
  );
};

export default connect(({ ordersList, baseData, loading }) => ({
  loadings: loading,
  ordersList,
  hubData: baseData.hubData,
  loading: loading.effects['ordersList/fetchGetList'],
}))(GoodsOrders);
