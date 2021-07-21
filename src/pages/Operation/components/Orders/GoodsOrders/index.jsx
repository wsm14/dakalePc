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
import TableDataBlock from '@/components/TableDataBlock';
import OrderDetailDraw from '../OrderDetailDraw';
import PopImgShow from '@/components/PopImgShow';
import Ellipsis from '@/components/Ellipsis';
import coupon from '@public/coupon.png';
import excelHeder from './excelHeder';
import styles from '../style.less';

const GoodsOrders = (props) => {
  const { ordersList, loading, dispatch, tabkey } = props;
  const { list } = ordersList;

  const [visible, setVisible] = useState(false);

  const childRef = useRef();

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
      label: '商品名称',
      name: 'goodsName',
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
      label: '地区',
      name: 'city',
      type: 'cascader',
      changeOnSelect: true,
      valuesKey: ['provinceCode', 'cityCode', 'districtCode'],
      onChange: (val) => val.length === 3 && fetchGetHubSelect(val[2]),
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '商品',
      dataIndex: 'goodsImg',
      render: (val, row) => (
        <Badge.Ribbon text={ORDER_TYPE_PROPS[row.orderType]} color="cyan" placement="start">
          <PopImgShow url={row.goodsImg || coupon} onClick={row.goodsImg ? null : () => {}}>
            <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 5 }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {row.goodsType && row.goodsType !== 'reduce' && (
                  <Tag color="magenta">{GOODS_CLASS_TYPE[row.goodsType]}</Tag>
                )}
                <Ellipsis length={10} tooltip>
                  {row.goodsName}
                </Ellipsis>
              </div>
              <div style={{ marginTop: 5 }} className={styles.specFont}>
                订单号：{row.orderSn}
              </div>
            </div>
          </PopImgShow>
        </Badge.Ribbon>
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
          <div
            className={styles.specFont}
          >{`${row.merchantProvince}-${row.merchantCity}-${row.merchantDistrict}`}</div>
        </div>
      ),
    },
    {
      title: '下单人',
      align: 'center',
      dataIndex: 'userMobile',
      render: (val, row) => `${row.userName}\n${val}\n${row.beanCode}`,
    },
    {
      title: '单价/数量',
      align: 'center',
      dataIndex: 'realPrice',
      render: (val, row) => `￥${val || 0}\n×${row.goodsCount || 0}`,
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
      title: '下单/核销时间',
      dataIndex: 'createTime',
      align: 'center',
      render: (val, row) => (
        <div style={{ textAlign: 'center' }}>
          <div>{val}</div>
          <div className={styles.fontColor}>已核销：{row.verificationCount}</div>
          <div className={styles.fontColor}>{row.verificationTime}</div>
        </div>
      ),
    },
    {
      title: '状态',
      align: 'center',
      dataIndex: 'status',
      render: (val, row) => (
        <>
          <span style={{ display: 'inline-flex', marginBottom: 5 }}>
            {ORDERS_STATUS[val]}
            <Avatar
              src={ORDER_PAY_LOGO[row.orderSource]}
              size="small"
              shape="square"
              style={{ marginLeft: 5 }}
            />
          </span>
          <div style={{ color: '#999' }}>{ORDER_CLOSE_TYPE[row.closeType]}</div>
        </>
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
        tabkey={tabkey}
        loading={loading}
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
  loading: loading.models.ordersList,
}))(GoodsOrders);
