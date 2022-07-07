import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { Tag, Badge } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useUpdateEffect } from 'ahooks';
import {
  REFUND_ORDERS_STATUS,
  BUSINESS_TYPE,
  REFUND_ORDERS_TYPE,
  SPECIAL_GOODS_TYPE,
  ELECTRICGOODS_SELL_STATUS,
} from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';
import PopImgShow from '@/components/PopImgShow';
import Ellipsis from '@/components/Ellipsis';
import RefundModal from '../RefundList/RefundModal';
import OrderDetailDraw from '../RefundOrder/OrderDetailDraw';
import LogisticsDraw from '../RefundOrder/LogisticsDraw';
import ConfirmRefundModal from '../RefundOrder/ConfirmRefundModal';
import { checkCityName } from '@/utils/utils';

const RefundOrderList = (props) => {
  const { refundOrder, loading, loadings, dispatch, tabKey } = props;
  const { list = [] } = refundOrder;
  // const [tabKey, setTabKey] = useState('specialGoods');
  const [infoVisible, setinfoVisible] = useState(false);
  const [refundModal, setRefundModal] = useState({ detail: {}, show: false }); //备注弹窗
  const [logisticsVisible, setLogisticsVisible] = useState({ show: false, detail: {} }); //查看物流弹窗
  const [confirmVisible, setConfirmVisible] = useState({ show: false, detail: {} }); //确认立即退款的弹窗

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
    {
      key: 'communityGoods',
      tab: '团购订单',
    },
  ];

  // 搜索参数
  const searchItems = [
    {
      label: '订单号',
      name: 'orderSn',
    },
    // {
    //   label: '商品名称',
    //   name: 'goodsName',
    // },
    // {
    //   label: '供应商',
    //   name: 'ownerId',
    // },
    {
      label: '下单人',
      type: 'user',
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
      name: 'completeRefundBeginTime',
      end: 'completeRefundEndTime',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '下单商品/订单号',
      dataIndex: 'orderDesc',
      align: 'center',
      render: (val, row) => {
        const { commerceGoods = {}, specialGoods = {}, orderType } = val;
        return (
          <div style={{ display: 'flex' }}>
            {/* <Badge.Ribbon
              text={
                {
                  commerceGoods: ELECTRICGOODS_SELL_STATUS[commerceGoods.goodsClass],
                  specialGoods: SPECIAL_GOODS_TYPE[[specialGoods.goodsClass]],
                }[orderType]
              }
              color="cyan"
              placement="start"
            > */}
            <PopImgShow url={commerceGoods.goodsImg || specialGoods.goodsImg} />
            {/* </Badge.Ribbon> */}
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
                  {commerceGoods.goodsName || specialGoods.goodsName}
                </Ellipsis>
              </div>
              <div style={{ display: 'flex' }}>{row.orderSn}</div>
            </div>
          </div>
        );
      },
    },
    {
      title: '所属店铺/地区',
      dataIndex: 'merchantInfo',
      show: ['specialGoods'].includes(tabKey),
      render: (val, row) => {
        const { relateType, merchantGroupInfo = {} } = row;
        return (
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
                <Tag>{BUSINESS_TYPE[relateType]}</Tag>
                <Ellipsis length={10} tooltip>
                  {relateType === 'merchant'
                    ? val.merchantName
                    : merchantGroupInfo.merchantGroupName}
                </Ellipsis>
              </div>
              <div style={{ display: 'flex' }}>
                {checkCityName(
                  relateType === 'merchat' ? val.districtCode : merchantGroupInfo.districtCode,
                )}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: '规格/供应商',
      show: ['commerceGoods'].includes(tabKey),
      align: 'center',
      dataIndex: 'supplierInfo',
      render: (val, row) => {
        const { commerceGoods = {} } = row.orderDesc;
        const { attributeObjects = [] } = commerceGoods;
        return (
          <>
            <div>{attributeObjects.map((item) => item.value).join('/')}</div>
            <div>{val.supplierName}</div>
          </>
        );
      },
    },
    {
      title: '下单人',
      dataIndex: 'userInfo',
      align: 'center',
      render: (val, row) => `${val.userName}\n${val.mobile}\n${row.userId}`,
    },

    {
      title: '下单数量',
      dataIndex: 'goodsCount',
    },
    {
      title: '退款数量',
      dataIndex: 'refundCount',
    },
    {
      title: '申请退款金额',
      dataIndex: 'refundFee',
      render: (val, row) => {
        const cashBean = row.refundBean ? row.refundBean / 100 : 0;
        const refundPrice = Number(val) + cashBean > 0 ? (Number(val) + cashBean).toFixed(2) : 0;
        return `￥${refundPrice}\n(含${row.refundBean || 0}卡豆)`;
      },
    },
    {
      title: { commerceGoods: '发货状态/退款申请时间', specialGoods: '退款申请时间' }[tabKey],
      align: 'center',
      dataIndex: 'createTime',
      render: (val, row) => {
        return {
          commerceGoods: `${row?.orderLogisticInfo?.logisticsCode ? '已发货' : '未发货'}\n${val}`,
          specialGoods: `${val}`,
        }[tabKey];
      },
    },
    {
      title: '退款类型',
      dataIndex: 'refundType',
      show: ['commerceGoods'].includes(tabKey),
      render: (val) => REFUND_ORDERS_TYPE[val],
    },
    {
      title: '退款原因',
      dataIndex: 'refundReason',
    },
    {
      title: '寄回状态/寄回单号',
      dataIndex: 'logisticsParam',
      align: 'center',
      show: ['commerceGoods'].includes(tabKey),
      render: (val, row) => {
        const { code, name } = val;
        const renderItem = Object.keys(val).length ? (
          <div>
            <div>已寄回</div>
            <div>
              {name}
              {code}
            </div>
            <a
              onClick={() => {
                handleGetLogistics(row);
              }}
            >
              查看物流
            </a>
          </div>
        ) : (
          '未寄回'
        );
        return renderItem;
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
      render: (val) => (
        <Ellipsis length={10} tooltip>
          {val}
        </Ellipsis>
      ),
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
            click: () => {
              setConfirmVisible({ show: true, detail: row });
            },
            visible: ['0'].includes(row.status),
          },
        ];
      },
    },
  ];

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

  //查看详情
  const fetchRefundDetail = (index) => {
    const { orderId, userId } = list[index];
    dispatch({
      type: 'ordersList/fetchGetOrderDetail',
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
  const handleGetLogistics = (val) => {
    const { logisticsParam, orderLogisticInfo } = val;
    const { companyCode, code, mobile } = logisticsParam;
    dispatch({
      type: 'refundOrder/fetchGetExpressInfo',
      payload: {
        expressCompany: companyCode,
        expressNo: code,
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

  return (
    <>
      <TableDataBlock
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
        loading={loadings.effects['ordersList/fetchGetOrderDetail']}
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
      ></LogisticsDraw>
      {/* 确认退款弹窗 */}
      <ConfirmRefundModal
        visible={confirmVisible}
        onClose={() => {
          setConfirmVisible({ show: false });
        }}
        childRef={childRef}
      ></ConfirmRefundModal>
    </>
  );
};

export default connect(({ refundOrder, loading }) => ({
  refundOrder,
  loadings: loading,
  loading: loading.effects['refundOrder/fetchGetList'],
}))(RefundOrderList);
