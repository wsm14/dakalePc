import React, { useRef } from 'react';
import { connect } from 'umi';
import ExcelButton from '@/components/ExcelButton';
import TableDataBlock from '@/components/TableDataBlock';
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
    {
      label: '商圈',
      name: 'businessHubIdStr',
      type: 'select',
      loading: loadings.models.baseData,
      allItem: false,
      select: hubData,
      fieldNames: { label: 'businessHubName', value: 'businessHubIdString' },
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
      title: '店铺名称',
      align: 'center',
      dataIndex: 'merchantName',
    },
    {
      title: '订单金额',
      align: 'right',
      dataIndex: 'payFee',
      render: (val, record) => `￥${val}（含${record.beanFee ? record.beanFee : 0}卡豆）`,
    },
    {
      title: '店铺实收总额',
      align: 'right',
      dataIndex: 'actualCashFee',
      render: (val, record) =>
        `￥${val}（含${record.actualBeanFee ? record.actualBeanFee : 0}卡豆）`,
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
      title: '订单来源',
      align: 'center',
      dataIndex: 'orderSource',
    },
    {
      title: '区域',
      align: 'center',
      dataIndex: 'provinceName',
      render: (val, record) => `${val}-${record.cityName}-${record.districtName}`,
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
    <TableDataBlock
      noCard={false}
      btnExtra={({ get }) => (
        <ExcelButton
          dispatchType={'ordersList/fetchOrdersImport'}
          dispatchData={{ ...get(), goodsOrScanFlag: tabkey }}
          exportProps={{ header: getColumns.slice(0, -1) }}
        ></ExcelButton>
      )}
      cRef={childRef}
      loading={loading}
      columns={getColumns}
      searchItems={searchItems}
      params={{ goodsOrScanFlag: tabkey }}
      rowKey={(record) => `${record.orderSn}`}
      dispatchType="ordersList/fetchGetList"
      {...ordersList}
    ></TableDataBlock>
  );
};

export default connect(({ ordersList, baseData, loading }) => ({
  loadings: loading,
  ordersList,
  hubData: baseData.hubData,
  loading: loading.effects['ordersList/fetchGetList'],
}))(CodeOrders);
