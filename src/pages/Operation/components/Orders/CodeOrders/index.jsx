import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import ExcelButton from '@/components/ExcelButton';
import TableDataBlock from '@/components/TableDataBlock';
import OrderDetailDraw from '../OrderDetailDraw';
import HandleSetTable from '@/components/TableDataBlock/HandleSetTable';

const CodeOrders = (props) => {
  const { ordersList, loading, dispatch, hubData, loadings, tabkey } = props;
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
      dataIndex: 'merchantName',
      ellipsis: true,
    },
    {
      title: '用户支付',
      align: 'right',
      dataIndex: 'payFee',
      render: (val, record) => `￥${val}（含${record.beanFee ? record.beanFee : 0}卡豆）`,
    },
    {
      title: '店铺实收',
      align: 'right',
      dataIndex: 'actualCashFee',
      render: (val, record) =>
        `￥${val}（含${record.actualBeanFee ? record.actualBeanFee : 0}卡豆）`,
    },
    {
      title: '优惠券',
      dataIndex: 'reduceFee',
      render: (val) => (val ? `${val}元抵扣券（-￥${val || 0}）` : '--'),
    },
    {
      title: '支付时间',
      align: 'center',
      dataIndex: 'createTime',
    },

    {
      title: '下单渠道',
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
      render: (val, record, index) => (
        <HandleSetTable
          formItems={[
            {
              type: 'info',
              click: () => fetchGoodsDetail(index),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <>
      <TableDataBlock
        noCard={false}
        btnExtra={({ get }) => (
          <ExcelButton
            dispatchType={'ordersList/fetchOrdersImport'}
            dispatchData={{ ...get(), goodsOrScanFlag: tabkey }}
            exportProps={{
              header: getColumns.slice(0, -1),
              fieldRender: { merchantName: (val) => val },
            }}
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
  hubData: baseData.hubData,
  loading: loading.effects['ordersList/fetchGetList'],
}))(CodeOrders);
