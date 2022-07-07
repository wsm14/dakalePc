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
import LogisticsDraw from '../LogisticsDraw';
import excelHeder from './excelHeder';
import styles from '../style.less';

const CommerceGoods = (props) => {
  const { ordersList, loading, loadings, dispatch, tabkey } = props;
  const { list } = ordersList;

  const [visible, setVisible] = useState(false);
  const [visivleSet, setVisivleSet] = useState(false);
  const [visibleRouting, setVisibleRouting] = useState(false);
  const [logisticsVisible, setLogisticsVisible] = useState({ show: false, detail: {} }); //查看物流弹窗

  const childRef = useRef();

  // 搜索参数
  const searchItems = [
    {
      label: '订单号',
      name: 'orderSn',
    },
    // {
    //   label: '商品名称',
    //   name: 'goodsId',
    //   type: 'good',
    // },
    // {
    //   label: '供应商',
    //   name: 'relateOwnerId',
    //   type: 'supplier',
    // },
    {
      label: '下单人',
      name: 'userId',
      type: 'user',
    },
    {
      label: '订单状态',
      name: 'status',
      type: 'select',
      allItem: false,
      select: ORDER_STATUS,
    },
    {
      label: '下单日期',
      type: 'rangePicker',
      name: 'createBeginTime',
      end: 'createEndTime',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '商品主图',
      dataIndex: ['orderDesc', 'commerceGoods'],
      render: (val, row) => (
        // <Badge.Ribbon text={ELECTRICGOODS_SELL_STATUS[row.sellType]} color="cyan" placement="start">
        <PopImgShow url={val?.goodsImg} />
        // </Badge.Ribbon>
      ),
    },
    {
      title: '商品名称',
      dataIndex: ['orderDesc', 'commerceGoods'],
      render: (val, row) => (
        <div>
          <Ellipsis length={15} tooltip>
            {val?.goodsName}
          </Ellipsis>
          <div style={{ marginTop: 5 }} className={styles.specFont}>
            {row.orderSn}
          </div>
        </div>
      ),
    },
    {
      title: '规格/供应商',
      dataIndex: ['orderDesc', 'commerceGoods', 'attributeObjects'],
      render: (val, row) => (
        <div>
          <div>{val?.map((item) => item.value).join('/')}</div>
          <div>{row?.supplierInfo?.supplierName}</div>
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
      title: '单价/数量',
      align: 'center',
      dataIndex: ['orderDesc', 'commerceGoods'],
      render: (val, row) => {
        const num = Number(val?.sellPrice || 0) + Number(val?.sellBean || 0) / 100;

        return (
          <div>
            <div>{`￥${num.toFixed(2) || 0}`}</div>
            <div>{`×${row?.goodsCount || 0}`}</div>
          </div>
        );
      },
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
      dataIndex: 'deductFee',
      render: (val) =>
        Object.keys(val).length > 0 ? (
          <>
            <div>{`${val[0]?.reduceFee || 0}元${val[0]?.deductTypeName || ''}`}</div>
            <div>{val[0]?.platformCouponId || ''}</div>
          </>
        ) : (
          '-'
        ),
    },
    {
      title: '供应商实收',
      align: 'center',
      dataIndex: 'settleParam',
      render: (val, record) => {
        return (
          <div style={{ textAlign: 'center' }}>
            <div>{`￥${val?.settlePrice || 0}`}</div>
          </div>
        );
      },
    },
    {
      title: '商品佣金',
      align: 'center',
      dataIndex: 'divisionParam',
      render: (val, record) => {
        return (
          <div style={{ textAlign: 'center' }}>
            <div>{`￥${val?.commission || 0}`}</div>
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
      title: '备注',
      align: 'center',
      dataIndex: 'orderDesc',
      render: (val) => val?.remark || '-',
    },
    {
      title: '物流状态',
      dataIndex: 'orderLogisticInfo',
      render: (val, row) => (row.status == '2' ? '' : val.logisticsCode ? '已发货' : '未发货'),
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
          visible: ['1'].includes(record.status) && !record?.orderLogisticInfo?.logisticsCode,
          click: () => fetchOderDrawer(record),
        },
        {
          // 查看物流
          type: 'goodsView',
          visible: !!record?.orderLogisticInfo?.logisticsCode,
          click: () => handleGetLogistics(record),
        },
        {
          // 分账   已付款且已发货才可以分账，分账后状态变为3（交易完成）
          title: '分账',
          type: 'routing',
          pop: true,
          popText: '确定要进行分账吗？分账后无法取消。',
          visible: ['1'].includes(record.status) && !!record.orderLogisticInfo.logisticsCode,
          click: () => handleOk(val),
        },
      ],
    },
  ];

  //查看物流
  const handleGetLogistics = (val) => {
    const {
      orderLogisticInfo, //发货信息对象
    } = val;

    const { mobile, companyCode, logisticsCode } = orderLogisticInfo;
    dispatch({
      type: 'refundOrder/fetchGetExpressInfo',
      payload: {
        expressCompany: companyCode,
        expressNo: logisticsCode,
        receiveUserMobile: mobile,
      },
      callback: (detail) => {
        setLogisticsVisible({
          show: true,
          detail: { ...detail, orderLogisticInfo },
        });
      },
    });
  };

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

  //发货
  const fetchOderDrawer = (record) => {
    const { orderId, userId } = record;
    setVisivleSet({
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

  const extraBtn = ({ get }) => [
    {
      // 导出所有未发货的电商订单(暂时)
      type: 'excel',
      dispatch: 'ordersList/fetchExportUndeliveredCommerceGoodsOrderList',
      data: { ...get() },
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
      {/* 查看物流 */}
      <LogisticsDraw
        visible={logisticsVisible}
        onClose={() => {
          setLogisticsVisible({ show: false });
        }}
      ></LogisticsDraw>
    </>
  );
};

export default connect(({ ordersList, baseData, loading }) => ({
  loadings: loading,
  ordersList: ordersList.newList,
  hubData: baseData.hubData,
  loading:
    loading.effects['ordersList/fetchPageListOrdersList'] ||
    loading.effects['ordersList/fetchExportUndeliveredCommerceGoodsOrderList'],
}))(CommerceGoods);
