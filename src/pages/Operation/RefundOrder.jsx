import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { Modal, Tag } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useUpdateEffect } from 'ahooks';
import {
  REFUND_ORDERS_STATUS,
  GOODS_CLASS_TYPE,
  TAG_COLOR_TYPE,
  BUSINESS_TYPE,
} from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';
import PopImgShow from '@/components/PopImgShow';
import Ellipsis from '@/components/Ellipsis';
import RefundModal from './components/RefundList/RefundModal';
import OrderDetailDraw from './components/Orders/OrderDetailDraw';
import LogisticsDraw from './components/RefundOrder/LogisticsDraw';
import { checkCityName } from '@/utils/utils';
const { confirm } = Modal;

const RefundOrder = (props) => {
  const { refundOrder, loading, loadings, dispatch } = props;
  const { list = [] } = refundOrder;
  const [tabKey, setTabKey] = useState('specialGoods');
  const [infoVisible, setinfoVisible] = useState(false);
  const [refundModal, setRefundModal] = useState({ detail: {}, show: false }); //备注弹窗
  const [logisticsVisible, setLogisticsVisible] = useState({ show: false, detail: {} }); //查看物流弹窗

  const childRef = useRef();

  useUpdateEffect(() => {
    childRef.current && childRef.current.fetchGetData({ orderType: tabKey });
  }, [tabKey]);
  // tab栏列表
  const tabList = [
    {
      key: 'specialGoods',
      tab: '特惠订单',
    },
    {
      key: 'commerceGoods',
      tab: '电商订单',
    },
  ];

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
      label: '供应商',
      name: 'ownerId',
    },
    {
      label: '下单人',
      name: 'userId',
    },
    {
      label: '退款状态',
      type: 'select',
      name: 'status',
      select: REFUND_ORDERS_STATUS,
    },
    {
      label: '退款原因',
      name: 'refundReason',
    },
    {
      label: '退款日期',
      type: 'rangePicker',
      name: 'refundReason',
      name: 'completeRefundBeginTime',
      end: 'completeRefundEndTime',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '下单商品/订单号',
      dataIndex: 'goodsName',
      align: 'center',
      render: (val, row) => (
        <div style={{ display: 'flex' }}>
          <PopImgShow url={row.refundImg} />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              flex: 1,
              marginLeft: 5,
            }}
          >
            <div style={{ display: 'flex' }}>
              <Ellipsis length={10} tooltip>
                {val}
              </Ellipsis>
            </div>
            <div style={{ display: 'flex' }}>{row.orderSn}</div>
          </div>
        </div>
      ),
    },
    {
      title: '所属店铺/地区',
      dataIndex: 'goodsImg',
      show: ['specialGoods'].includes(tabKey),
      render: (val, row) => (
        <div style={{ display: 'flex' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              flex: 1,
              marginLeft: 5,
            }}
          >
            <div style={{ display: 'flex' }}>
              <Tag>{BUSINESS_TYPE[row.relateType]}</Tag>
              <Ellipsis length={10} tooltip>
                {row.relateName}
              </Ellipsis>
            </div>
            <div style={{ display: 'flex' }}>{checkCityName(row.districtCode)}</div>
          </div>
        </div>
      ),
    },
    {
      title: '供应商',
      show: ['commerceGoods'].includes(tabKey),
      dataIndex: 'applicantName',
    },
    {
      title: '下单人',
      dataIndex: 'userMobile',
      align: 'center',
      render: (val, row) => `${row.userName}\n${val}\n${row.beanCode}`,
    },

    {
      title: '下单数量',
      dataIndex: 'orderSn',
    },
    {
      title: '退款数量',
      dataIndex: 'refundCount',
    },
    {
      title: '申请退款金额',
      dataIndex: 'refundTotalFee',
      render: () => (val, row) => `${val}\n(含${row.refundBean || 0}卡豆)`,
    },
    {
      title: { specialGoods: '发货状态/退款申请时间', commerceGoods: '退款申请时间' }[tabKey],
      align: 'center',
      dataIndex: 'submitRefundTime',
      render: (val, row) => {
        return { specialGoods: `${row.creatorName}}\n${val}`, commerceGoods: `${val}` }[tabKey];
      },
    },
    {
      title: '退款原因',
      dataIndex: 'refundReason',
    },
    {
      title: '寄回状态/寄回单号',
      dataIndex: 'aaa',
      align: 'center',
      visible: ['commerceGoods'].includes(tabKey),
      render: () => {
        return (
          <div>
            <div>已寄回</div>
            <div>111111</div>
            <a
              onClick={() => {
                handleGetLogistics();
              }}
            >
              查看物流
            </a>
          </div>
        );
      },
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      render: (val) => ['退款中/待退款', '已退款', '取消退款'][val],
    },
    {
      title: '退款完成时间',
      dataIndex: 'completeRefundTime',
      show: ['specialGoods'].includes(tabKey),
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
    {
      type: 'handle',
      dataIndex: 'orderRefundId',
      width: 150,
      render: (val, row, index) => {
        return [
          {
            type: 'info',
            click: () => fetchRefundDetail(index),
          },
          {
            type: 'remark',
            click: () =>
              setRefundModal({
                show: true,
                detail: row,
                formProps: { type: 'remark', key: 'remark', handleClick: handleRemark },
              }),
          },
          {
            type: 'payBack',
            // pop: true,
            click: () =>
              handleModal({ orderRefundId: val, orderSn: row.orderSn, userId: row.userId }),
            visible: ['0'].includes(row.status),
          },
        ];
      },
    },
  ];

  //确认退款弹窗
  const handleModal = (values) => {
    confirm({
      title: '提示',
      icon: <ExclamationCircleOutlined />,
      content: '确定立即退款吗？确定后将直接退款给用户',
      onOk() {
        handlePayBack(values);
      },
      onCancel() {},
    });
  };

  //备注
  const handleRemark = (values, detail) => {
    const { orderRefundId, userId } = detail;
    dispatch({
      type: 'refundOrder/fetchRefundOrderRemark',
      payload: {
        ...values,
        orderRefundId,
        userId,
      },
      callback: () => {
        setRefundModal({ show: false, detail: {} });
        childRef.current.fetchGetData();
      },
    });
  };

  //立即退款
  const handlePayBack = (values) => {
    dispatch({
      type: 'refundOrder/fetchRefundPayBack',
      payload: {
        ...values,
      },
      callback: () => {
        childRef.current.fetchGetData();
      },
    });
  };

  //查看详情
  const fetchRefundDetail = (index) => {
    const { orderId, userId } = list[index];
    console.log(orderId, userId);
    dispatch({
      type: 'refundOrder/fetchRefundRrderDetail',
      payload: {
        orderId,
        userId,
      },
      callback: (detail) => {
        setinfoVisible({
          index,
          show: true,
          detail,
        });
      },
    });
  };

  //查看物流
  const handleGetLogistics = () => {
    setLogisticsVisible({ show: true });
  };

  return (
    <>
      <TableDataBlock
        cardProps={{
          tabList: tabList,
          activeTabKey: tabKey,
          onTabChange: setTabKey,
        }}
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.orderRefundId}`}
        params={{ orderType: tabKey }}
        dispatchType="refundOrder/fetchGetList"
        {...refundOrder}
      ></TableDataBlock>
      {/* 备注 */}
      <RefundModal
        visible={refundModal}
        onClose={() => setRefundModal({ show: false, detail: {} })}
      ></RefundModal>
      {/* 详情页面 */}
      <OrderDetailDraw
        childRef={childRef}
        visible={infoVisible}
        total={list.length}
        tabkey={tabKey}
        loading={loadings.effects['refundOrder/fetchRefundRrderDetail']}
        getDetail={fetchRefundDetail}
        onClose={() => {
          setinfoVisible({ show: false });
        }}
      ></OrderDetailDraw>

      {/* 查看物流 */}
      <LogisticsDraw
        visible={logisticsVisible}
        onClose={() => {
          setLogisticsVisible({ show: false });
        }}
      />
    </>
  );
};

export default connect(({ refundOrder, loading }) => ({
  refundOrder,
  loadings: loading,
  loading: loading.effects['refundOrder/fetchGetList'],
}))(RefundOrder);
