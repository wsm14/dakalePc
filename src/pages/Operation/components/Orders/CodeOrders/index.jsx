import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { Tag, Avatar } from 'antd';
import { ORDER_PAY_LOGO, BUSINESS_TYPE } from '@/common/constant';
import { checkCityName } from '@/utils/utils';
import Ellipsis from '@/components/Ellipsis';
import TableDataBlock from '@/components/TableDataBlock';
import OrderDetailDraw from '../OrderDetailDraw';
import excelHeder from './excelHeder';
import styles from '../style.less';

const CodeOrders = (props) => {
  const { ordersList, loading, loadings, dispatch, tabkey } = props;
  const { list } = ordersList;

  const childRef = useRef();
  const [visible, setVisible] = useState(false);

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
      type: 'user',
    },
    {
      label: '店铺/集团',
      name: 'merchantId',
      type: 'merchant',
    },
    {
      label: '支付日期',
      type: 'rangePicker',
      name: 'orderTimeStart',
      end: 'orderTimeEnd',
    },
    {
      label: '地区',
      name: 'city',
      type: 'cascader',
      changeOnSelect: true,
      valuesKey: ['provinceCode', 'cityCode', 'districtCode'],
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '订单号',
      fixed: 'left',
      dataIndex: 'orderSn',
      render: (val, row) => `${val}\n备注：${row.remark ? row.remark : '--'}`,
    },
    {
      title: '店铺',
      dataIndex: 'merchantName',
      render: (val, row) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div>账号:{row.merchantMobile}</div>
          <div style={{ display: 'flex', alignItems: 'center', margin: '5px 0' }}>
            <Tag color="magenta">{BUSINESS_TYPE[row.relateOwnerType]}</Tag>
            <Ellipsis length={10} tooltip>
              {val}
            </Ellipsis>
          </div>
          <div className={styles.specFont}>{checkCityName(row.merchantDistrict)}</div>
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
      title: '用户实付',
      align: 'center',
      dataIndex: 'payFee',
      render: (val, record) => {
        const cashBean = record.beanFee ? record.beanFee / 100 : 0;
        return (
          <div style={{ textAlign: 'center' }}>
            <div>{`￥${Number(val) + cashBean > 0 ? (Number(val) + cashBean).toFixed(2) : 0}`}</div>
            <div className={styles.fontColor}>
              {record.beanFee ? `(${record.beanFee}卡豆` : '(' + '0卡豆'}
            </div>
            <div className={styles.fontColor}>{(val ? `+ ￥${val}` : 0) + ')'}</div>
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
      render: (val, record) => {
        const actualBean = record.actualBeanFee ? record.actualBeanFee / 100 : 0;
        return (
          <div style={{ textAlign: 'center' }}>
            <div>{`￥${Number(val) + actualBean ? (Number(val) + actualBean).toFixed(2) : 0}`}</div>
            <div className={styles.fontColor}>
              {record.actualBeanFee ? `(${record.actualBeanFee}卡豆` : '(' + '0卡豆'}
            </div>
            <div className={styles.fontColor}>{(val ? `+ ￥${val}` : 0) + ')'}</div>
          </div>
        );
      },
    },
    {
      title: '商品佣金',
      align: 'center',
      dataIndex: 'cashCommission',
      render: (val, record) => {
        const beanCount = record.beanCommission ? record.beanCommission / 100 : 0;
        return (
          <div style={{ textAlign: 'center' }}>
            <div>{`￥${Number(val) + beanCount ? (Number(val) + beanCount).toFixed(2) : 0}`}</div>
            <div className={styles.fontColor}>
              {record.beanCommission ? `(${record.beanCommission}卡豆` : '(' + '0卡豆'}
            </div>
            <div className={styles.fontColor}>{(val ? `+ ￥${val}` : 0) + ')'}</div>
          </div>
        );
      },
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
      exportProps: { header: excelHeder },
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
        childRef={childRef}
        visible={visible}
        total={list.length}
        tabkey={tabkey}
        loading={loadings.effects['ordersList/fetchOrderDetail']}
        onClose={() => setVisible(false)}
        getDetail={fetchGoodsDetail}
      ></OrderDetailDraw>
    </>
  );
};

export default connect(({ ordersList, loading }) => ({
  loadings: loading,
  ordersList,
  loading: loading.models.ordersList,
}))(CodeOrders);
