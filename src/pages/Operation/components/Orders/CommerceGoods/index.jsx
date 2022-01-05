import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { Avatar, Modal } from 'antd';
import { COMMERCE_ORDERS_STATUS, ORDER_CLOSE_TYPE, ORDER_PAY_LOGO } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';
import OrderDetailDraw from '../OrderDetailDraw';
import Ellipsis from '@/components/Ellipsis';
import excelHeder from './excelHeder';
import OrderDrawer from './OrderDrawer';
import styles from '../style.less';

const CommerceGoods = (props) => {
  const { ordersList, loading, loadings, dispatch, tabkey } = props;
  const { list } = ordersList;

  const [visible, setVisible] = useState(false);
  const [visivleSet, setVisivleSet] = useState(false);
  const [goodsList, setGoodsList] = useState([]); // 选中的列表
  const [visibleRouting, setVisibleRouting] = useState(false);

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

  const fetchOderDrawer = (type, record) => {
    const { orderLogistics = {}, orderId } = record;
    setVisivleSet({
      type,
      show: true,
      detail: {
        ...orderLogistics,
        orderId,
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
      label: '商品',
      name: 'goodsId',
      type: 'good',
    },
    {
      label: '下单人',
      name: 'userId',
      type: 'user',
    },
    {
      label: '订单状态',
      name: 'status',
      type: 'select',
      select: COMMERCE_ORDERS_STATUS,
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
        <>
          <Ellipsis length={15} tooltip>
            {val}
          </Ellipsis>
          <div style={{ marginTop: 5 }} className={styles.specFont}>
            <Ellipsis length={12} tooltip>
              {`备注：${row?.remark}`}
            </Ellipsis>
          </div>
          <div style={{ marginTop: 5 }} className={styles.specFont}>
            订单号：{row.orderSn}
          </div>
        </>
      ),
    },
    {
      title: '下单人',
      align: 'center',
      dataIndex: 'userMobile',
      render: (val, row) => `${row.userName}\n${val}\n${row.beanCode}`,
    },
    {
      title: '数量',
      align: 'center',
      dataIndex: 'goodsCount',
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
            {COMMERCE_ORDERS_STATUS[val]}
            <Avatar
              src={ORDER_PAY_LOGO[row.orderSource]}
              size="small"
              shape="square"
              style={{ marginLeft: 5 }}
            />
          </span>
          {(val === 2 || val === 6) && (
            <div style={{ color: '#999' }}>{ORDER_CLOSE_TYPE[row.closeType]}</div>
          )}
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
          type: 'goodsDeliver',
          visible: ['1'].includes(record.status),
          click: () => fetchOderDrawer('add', record),
        },
        {
          type: 'goodsView',
          visible: ['8'].includes(record.status),
          click: () => fetchOderDrawer('info', record),
        },
        {
          title: record?.status === '3' ? '已分账' : '分账',
          type: 'routing',
          pop: ['8'].includes(record.status) && true,
          popText: '确定要进行分账吗？分账后无法取消。',
          visible: ['3', '8'].includes(record.status),
          disabled: ['3'].includes(record.status),
          click: () => handleOk(val.split(','), 'one'),
        },
      ],
    },
  ];

  //  批量分账
  const handleOk = (id, type = '') => {
    dispatch({
      type: 'ordersList/fetchBatchSplitAccount',
      payload: {
        orderIdList: type === 'one' ? id : goodsList,
        type,
      },
      callback: () => {
        childRef.current.fetchGetData();
        setVisibleRouting(false);
      },
    });
  };

  const extraBtn = ({ get }) => [
    {
      type: 'excel',
      dispatch: 'ordersList/fetchOrdersImport',
      data: { ...get(), orderType: tabkey },
      exportProps: { header: excelHeder },
    },
    {
      text: '批量分账',
      auth: 'batchRouting',
      onClick: () => setVisibleRouting(true),
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
        params={{ orderType: tabkey }}
        rowKey={(record) => `${record.orderId}`}
        rowSelection={{
          // getCheckboxProps: ({ status }) => ({
          //   disabled: ['1', '8'].includes(status),
          // }),
          onChange: setGoodsList,
        }}
        dispatchType="ordersList/fetchGetList"
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
    loading.effects['ordersList/fetchGetList'] || loading.effects['ordersList/fetchOrdersImport'],
}))(CommerceGoods);
