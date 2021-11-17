import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { Tag, Badge, Avatar } from 'antd';
import {
  ORDERS_STATUS,
  ORDER_TYPE_PROPS,
  ORDER_CLOSE_TYPE,
  ORDER_PAY_LOGO,
} from '@/common/constant';
import { checkCityName } from '@/utils/utils';
import TableDataBlock from '@/components/TableDataBlock';
import OrderDetailDraw from '../OrderDetailDraw';
import Ellipsis from '@/components/Ellipsis';
import styles from '../style.less';

const GroupBuyOrders = (props) => {
  const { ordersList, loading, loadings, dispatch, tabkey } = props;
  const { list } = ordersList;

  const [visible, setVisible] = useState(false);
  const [rowKey, setRowKey] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [visivleSet, setVisivleSet] = useState(false);

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

  //发货和查看详情

  const fetchOderDrawer = (type, index) => {
    setVisivleSet({
      type,
      show: true,
    });
  };

  // 搜索参数
  const searchItems = [
    {
      label: '订单号',
      name: 'orderSn',
    },
    {
      label: '商品/券名称',
      name: 'goodsId',
      type: 'good',
    },
    {
      label: '下单人',
      name: 'userId',
      type: 'user',
    },
    {
      label: '团长',
      name: 'merchantId',
      type: 'merchant',
    },
    {
      label: '订单属性',
      type: 'select',
      name: 'orderType',
      select: ORDER_TYPE_PROPS,
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
  ];

  // table 表头
  const getColumns = [
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      render: (val, row) => (
        <Ellipsis length={10} tooltip>
          {val}
        </Ellipsis>
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
      dataIndex: 'goodsCount',
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
      render: (val, row) => ORDERS_STATUS[val],
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

  const expandedRowRender = (columns) => {
    return (
      <TableDataBlock
        noCard={false}
        pagination={false}
        size="middle"
        tableSize="small"
        columns={columns}
        loading={loading}
        rowKey={(record) => `${record.id}`}
        list={cityList}
      ></TableDataBlock>
    );
  };

  // 获取详情
  const fetchAreaQueryOrderInfo = (payload) => {
    dispatch({
      type: 'areaQuery/fetchAreaQueryCityInfo',
      payload,
      callback: setCityList,
    });
  };

  return (
    <>
      <TableDataBlock
        noCard={false}
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        params={{ goodsOrScanFlag: tabkey }}
        rowKey={(record) => `${record.orderId}`}
        dispatchType="ordersList/fetchGetList"
        expandable={{
          expandedRowKeys: rowKey,
          onExpand: (expanded, row) => {
            console.log(expanded, row);
            if (expanded) {
              fetchAreaQueryOrderInfo({ pid: row.id });
              setRowKey([`${row.id}`]);
            } else setRowKey([]);
          },
          expandedRowRender: () => expandedRowRender(getColumns),
        }}
        {...ordersList}
      ></TableDataBlock>
      {/* 详情 */}
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

export default connect(({ ordersList, baseData, loading }) => ({
  loadings: loading,
  ordersList,
  hubData: baseData.hubData,
  loading: loading.models.ordersList,
}))(GroupBuyOrders);
