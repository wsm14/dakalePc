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
import OrdersDetail from './components/RefundOrder/OrdersDetail';
import OrderDetailDraw from './components/Orders/OrderDetailDraw';
import { checkCityName } from '@/utils/utils';
const { confirm } = Modal;

const RefundOrder = (props) => {
  const { refundOrder, loading, loadings, dispatch } = props;
  const { list = [] } = refundOrder;
  const [tabKey, setTabKey] = useState('specialGoods');
  const [infoVisible, setinfoVisible] = useState(false);

  const childRef = useRef();

  useUpdateEffect(() => {
    childRef.current && childRef.current.fetchGetData();
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
      name: 'orderSn',
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
              <Tag color={TAG_COLOR_TYPE[row.orderType]}>{GOODS_CLASS_TYPE[row.orderType]}</Tag>
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
      title: '退款申请时间',
      align: 'center',
      dataIndex: 'submitRefundTime',
      render: (val, row) => `${val}\n${row.creatorName || ''}`,
    },
    {
      title: '退款原因',
      dataIndex: 'refundReason',
    },
    {
      title: '寄回状态/寄回单号',
      dataIndex: 'aaa',
      visible: ['commerceGoods'].includes(tabKey),
    },
    {
      title: '订单状态',
      dataIndex: 'auditStatus',
    },
    {
      title: '退款完成时间',
      dataIndex: 'completeRefundTime',
    },
    // {
    //   title: '物流状态',
    //   dataIndex: 'orderSn',
    // },
    {
      title: '备注',
      dataIndex: 'remarks',
    },
    {
      type: 'handle',
      dataIndex: 'adapayRefundId',
      width: 150,
      render: (val, row, index) => {
        return [
          {
            type: 'info',
            click: () => fetchRefundDetail(index),
          },
          {
            type: 'remarks',
            click: () => setRefundModal({ show: true, formProps: { type: 'remark' } }),
          },
          {
            type: 'payBack',
            // pop: true,
            click: () => handleModal(val),
          },
        ];
      },
    },
  ];

  //确认退款弹窗
  const handleModal = (val) => {
    confirm({
      title: '提示',
      icon: <ExclamationCircleOutlined />,
      content: '确定立即退款吗？确定后将直接退款给用户',
      onOk() {
        handlePayBack(val);
      },
      onCancel() {},
    });
  };

  //立即退款
  const handlePayBack = (val) => {
    dispatch({
      type: 'RefundList/fetchRefundRrderDetail',
      payload: {
        orderRefundId: val,
      },
      callback: () => {
        childRef.current.fetchGetData();
      },
    });
  };

  //查看详情
  const fetchRefundDetail = (index) => {
    const { adapayRefundId } = list[index];
    dispatch({
      type: 'RefundList/fetchRefundRrderDetail',
      payload: {
        orderRefundId: adapayRefundId,
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

  return (
    <>
      <TableDataBlock
        cardProps={{
          tabList: tabList,
          activeTabKey: tabKey,
          onTabChange: setTabKey,
          // tabBarExtraContent: <ExtraButton list={btnList}></ExtraButton>,
        }}
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.adapayRefundId}`}
        params={{ orderType: tabKey }}
        dispatchType="refundOrder/fetchGetList"
        {...refundOrder}
      ></TableDataBlock>

      {/* 详情页面 */}
      <OrderDetailDraw
        childRef={childRef}
        visible={infoVisible}
        total={list.length}
        tabkey={tabKey}
        loading={loadings.effects['RefundList/fetchRefundRrderDetail']}
        getDetail={fetchRefundDetail}
      ></OrderDetailDraw>
    </>
  );
};

export default connect(({ refundOrder, loading }) => ({
  refundOrder,
  loadings: loading,
  loading: loading.effects['refundOrder/fetchGetList'],
}))(RefundOrder);
