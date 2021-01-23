import React, { useRef } from 'react';
import { connect } from 'umi';
import { PAY_TYPE } from '@/common/constant';
import DataTableBlock from '@/components/DataTableBlock';
import OrdersDetail from '../OrdersDetail';

const CodeOrders = (props) => {
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
      title: '手机号',
      fixed: 'left',
      dataIndex: 'mobile',
    },
    {
      title: '订单金额',
      align: 'right',
      dataIndex: 'totalFee',
      render: (val) => `￥${val}`,
    },
    {
      title: '卡豆抵扣金额',
      align: 'right',
      dataIndex: 'beanFee',
      render: (val) => `￥${val / 100}`,
    },
    {
      title: '现金支付',
      align: 'right',
      dataIndex: 'payFee',
      render: (val, record) =>
        `￥${val || 0}${record.payType ? '（' + PAY_TYPE[record.payType] + '）' : ''}`,
    },
    {
      title: '优惠券',
      dataIndex: 'businessArea',
      render: (val) => `--`,
    },
    {
      title: '支付日期',
      align: 'center',
      dataIndex: 'createTime',
    },
    {
      title: '店铺名称',
      align: 'center',
      dataIndex: 'merchantName',
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
        noCard={false}
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
}))(CodeOrders);
