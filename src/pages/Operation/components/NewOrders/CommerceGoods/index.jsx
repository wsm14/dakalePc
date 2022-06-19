import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { Avatar, Badge, Modal } from 'antd';
import {
  ORDER_STATUS,
  ORDER_CLOSE_TYPE,
  ORDER_PAY_LOGO,
  ELECTRICGOODS_SELL_STATUS,
} from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';
import OrderDetailDraw from '../OrderDetailDraw';
import Ellipsis from '@/components/Ellipsis';
import PopImgShow from '@/components/PopImgShow';
import OrderDrawer from './OrderDrawer';
import styles from '../style.less';

const CommerceGoods = (props) => {
  const { ordersList, loading, loadings, dispatch, tabkey } = props;
  const { list } = ordersList;

  const [visible, setVisible] = useState(false);
  const [visivleSet, setVisivleSet] = useState(false);
  const [visibleRouting, setVisibleRouting] = useState(false);

  const childRef = useRef();

  // 搜索参数
  const searchItems = [
    {
      label: '订单号',
      name: 'orderSn',
    },
    {
      label: '商品名称',
      name: 'goodsId',
      type: 'good',
    },
    {
      label: '下单人',
      name: 'userId',
      type: 'user',
    },
    {
      label: '供应商',
      name: 'relateOwnerId',
      type: 'supplier',
    },
    {
      label: '订单状态',
      name: 'status',
      type: 'select',
      select: ORDER_STATUS,
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
      title: '商品主图',
      dataIndex: 'goodsImg',
      render: (val, row) => (
        <Badge.Ribbon text={ELECTRICGOODS_SELL_STATUS[row.sellType]} color="cyan" placement="start">
          <PopImgShow url={val} />
        </Badge.Ribbon>
      ),
    },
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      render: (val, row) => (
        <div>
          <Ellipsis length={15} tooltip>
            {val}
          </Ellipsis>
          <div style={{ marginTop: 5 }} className={styles.specFont}>
            {row.orderSn}
          </div>
        </div>
      ),
    },
    {
      title: '规格/供应商',
      dataIndex: 'supplierInfo',
      render: (val, row) => (
        <div>
          <div></div>
          <div>{val?.supplierName}</div>
        </div>
      ),
    },
    {
      title: '下单人',
      align: 'center',
      dataIndex: 'userInfo',
      render: (val, row) => `${val.userName}\n${val.mobile}\n${val.beanCode}`,
    },
    {
      title: '数量',
      align: 'center',
      dataIndex: 'goodsCount',
      render: (val, row) => (
        <div>
          <div></div>
          <div>{`×${val}`}</div>
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
      title: '平台券',
      align: 'center',
      dataIndex: 'deductFeeObject',
      render: (val) =>
        val ? (
          <>
            <div>{`${val[0]?.reduceFee || 0}元${val[0]?.deductTypeName || ''}`}</div>
            <div>{val[0]?.platformCouponId || ''}</div>
          </>
        ) : (
          '-'
        ),
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
      title: '下单时间',
      dataIndex: 'createTime',
      align: 'center',
    },
    {
      title: '订单状态',
      align: 'center',
      dataIndex: 'status',
      render: (val, row) => (
        <>
          <span style={{ display: 'inline-flex', marginBottom: 5 }}>
            <div>
              <div>{ORDER_STATUS[val]}</div>
              {['2'].includes(val) && <div>{`（${ORDER_CLOSE_TYPE[row.closeType]}）`}</div>}
            </div>
            <Avatar
              src={ORDER_PAY_LOGO[row.orderSource]}
              size="small"
              shape="square"
              style={{ marginLeft: 5 }}
            />
          </span>
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
        {
          // 发货
          type: 'goodsDeliver',
          visible: ['1'].includes(record.status),
          click: () => fetchOderDrawer('add', record),
        },
        {
          // 查看物流
          type: 'goodsView',
          // visible: ['3', '8'].includes(record.status),
          click: () => fetchOderDrawer('info', record),
        },
        {
          // 分账
          title: record?.status === '3' ? '已分账' : '分账',
          type: 'routing',
          pop: ['8'].includes(record.status) && true,
          popText: '确定要进行分账吗？分账后无法取消。',
          visible: ['3', '8'].includes(record.status),
          disabled: ['3'].includes(record.status),
          click: () => handleOk(val),
        },
      ],
    },
  ];

  //详情
  const fetchGoodsDetail = (index) => {
    const { orderId, userId } = list[index];
    dispatch({
      type: 'ordersList/fetchGetOrderDetail',
      payload: { orderId, userId },
      callback: (detail) => {
        setVisible({
          index,
          show: true,
          detail,
        });
      },
    });
  };

  //发货和查看物流
  const fetchOderDrawer = (type, record) => {
    const { orderId, userId } = record;
    setVisivleSet({
      type,
      show: true,
      detail: {
        userId,
        orderId,
      },
    });
  };

  //  分账
  const handleOk = (orderId) => {
    dispatch({
      type: 'ordersList/fetchSubLedger',
      payload: {
        orderId,
      },
      callback: () => {
        childRef.current.fetchGetData();
        setVisibleRouting(false);
      },
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
        params={{ orderType: tabkey }}
        rowKey={(record) => `${record.orderId}`}
        dispatchType="ordersList/fetchPageListOrdersList"
        {...ordersList}
      ></TableDataBlock>
      {/* 详情 */}
      <OrderDetailDraw
        childRef={childRef}
        visible={visible}
        total={list.length}
        tabkey={tabkey}
        loading={loadings.effects['ordersList/fetchGetOrderDetail']}
        onClose={() => setVisible(false)}
        getDetail={fetchGoodsDetail}
      ></OrderDetailDraw>
      {/* 发货 */}
      {/*  查看物流*/}
      <OrderDrawer childRef={childRef} visible={visivleSet} onClose={() => setVisivleSet(false)} />
      {/* 确认分账 */}
      <Modal
        title="提示"
        visible={visibleRouting}
        onOk={handleOk}
        onCancel={() => setVisibleRouting(false)}
      >
        确定要进行分账吗？分账后无法取消。
      </Modal>
    </>
  );
};

export default connect(({ ordersList, baseData, loading }) => ({
  loadings: loading,
  ordersList,
  hubData: baseData.hubData,
  loading:
    loading.effects['ordersList/fetchPageListOrdersList'] ||
    loading.effects['ordersList/fetchOrdersImport'],
}))(CommerceGoods);
