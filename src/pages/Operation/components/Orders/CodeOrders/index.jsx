import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import TableDataBlock from '@/components/TableDataBlock';
import OrderDetailDraw from '../OrderDetailDraw';
import { Tag } from 'antd';
import Ellipsis from '@/components/Ellipsis';

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
      title: '店铺',
      dataIndex: 'merchantName',
      render: (val, row) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* //账号 */}
          <div>账号:{row.mobile}</div>
          <div style={{ display: 'flex', alignItems: 'center', margin: '5px 0' }}>
            <Tag color="magenta">单品</Tag>
            <Ellipsis length={10} tooltip>
              {val}
            </Ellipsis>
          </div>
          <div>{`${row.provinceName}-${row.cityName}-${row.districtName}`}</div>
        </div>
      ),
    },
    {
      title: '用户',
      dataIndex: 'mobile',
      render: (val, row) => '--',
    },
    {
      title: '用户实付',
      align: 'center',
      dataIndex: 'payFee',
      render: (val, record) => (
        <div style={{ textAlign: 'center' }}>
          <div>{`￥${val}`}</div>
          <div>{+record.beanFee ? `(${record.beanFee}卡豆` : '(' + '0卡豆'}</div>
          <div>{(record.beanFee ? `+ ￥${(val - record.beanFee / 100).toFixed(2)}` : '+￥' + val) + ')'}</div>
        </div>
      ),
    },
    {
      title: '优惠券',
      dataIndex: 'reduceFee',
      render: (val) => (val ? `${val}元抵扣券` : '--'),
    },
    {
      title: '商户实收',
      dataIndex: 'actualCashFee',
      render: (val, record) =>
        `￥${val}（含${record.actualBeanFee ? record.actualBeanFee : 0}卡豆）`,
    },
    {
      title: '支付时间',
      align: 'center',
      dataIndex: 'createTime',
      render:(val,row)=>(
        <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
          <div>{val}</div>
          <Tag color="green" style={{marginLeft:5}}>{row.orderSource}</Tag>
        </div>
      )
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
  hubData: baseData.hubData,
  loading: loading.effects['ordersList/fetchGetList'],
}))(CodeOrders);
