import React, { useRef } from 'react';
import { connect } from 'umi';
import { ORDERS_STATUS, ORDERS_TYPE, ORDER_CLOSE_TYPE } from '@/common/constant';
import ExcelButton from '@/components/ExcelButton';
import Ellipsis from '@/components/Ellipsis';
import TableDataBlock from '@/components/TableDataBlock';
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
      label: '商品名称',
      name: 'goodsName',
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
      render: (val) => (
        <Ellipsis length={10} tooltip>
          {val || '--'}
        </Ellipsis>
      ),
    },
    {
      title: '购买数量',
      align: 'right',
      dataIndex: 'goodsCount',
    },
    {
      title: '用户支付金额',
      align: 'right',
      dataIndex: 'payFee',
      render: (val, record) => `￥${val}（含${record.beanFee ? record.beanFee : 0}卡豆）`,
    },
    {
      title: '商品佣金',
      align: 'center',
      dataIndex: 'estimatedCommission',
      render: (val) => `￥ ${val}`,
    },
    // {
    //   title: '商品佣金',
    //   align: 'right',
    //   dataIndex: 'cashCommission',
    //   render: (val, record) =>
    //     `￥${val}（含${record.beanCommission ? record.beanCommission : 0}卡豆）`,
    // },
    {
      title: '优惠券',
      dataIndex: 'businessArea',
      render: (val) => `--`,
    },
    {
      title: '下单时间',
      align: 'center',
      dataIndex: 'createTime',
    },
    {
      title: '下单渠道',
      align: 'center',
      dataIndex: 'orderSource',
    },
    {
      title: '核销数',
      align: 'center',
      dataIndex: 'verificationCount',
    },
    {
      title: '店铺实收总额',
      align: 'right',
      dataIndex: 'actualCashFee',
      render: (val, record) =>
        `￥${val}（含${record.actualBeanFee ? record.actualBeanFee : 0}卡豆）`,
    },
    {
      title: '核销时间',
      align: 'center',
      dataIndex: 'verificationTime',
    },
    {
      title: '店铺名称',
      align: 'center',
      dataIndex: 'merchantName',
      render: (val) => (
        <Ellipsis length={20} tooltip>
          {val}
        </Ellipsis>
      ),
    },
    {
      title: '区域',
      align: 'center',
      dataIndex: 'provinceName',
      render: (val, record) => `${val}-${record.cityName}-${record.districtName}`,
    },
    {
      title: '订单属性',
      align: 'center',
      dataIndex: 'orderType',
      render: (val) => ORDERS_TYPE[val],
    },
    {
      title: '状态',
      align: 'center',
      dataIndex: 'status',
      render: (val) => ORDERS_STATUS[val],
      // render: (val, row) => (val === '2' ? ORDER_CLOSE_TYPE[row.closeType] : ORDERS_STATUS[val]),
    },
    {
      title: '订单关闭类型',
      align: 'center',
      dataIndex: 'closeType',
      // hidden:
      render: (val) => ORDER_CLOSE_TYPE[val],
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
      btnExtra={({ get }) => (
        <ExcelButton
          dispatchType={'ordersList/fetchOrdersImport'}
          dispatchData={{ ...get(), goodsOrScanFlag: tabkey }}
          exportProps={{ header: getColumns.slice(0, -1) }}
        ></ExcelButton>
      )}
      noCard={false}
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
}))(GoodsOrders);
