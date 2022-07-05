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
import OrderDetailDraw from './OrderDetailDraw';
import LogisticsDraw from './LogisticsDraw';
import { checkCityName } from '@/utils/utils';
import styles from '../../style.less';

const RefundGroupOrderList = (props) => {
  const { refundOrder, loading, loadings, dispatch, tabKey } = props;
  const { list = [] } = refundOrder;
  const [infoVisible, setinfoVisible] = useState(false);
  const [refundModal, setRefundModal] = useState({ detail: {}, show: false }); //备注弹窗
  const [logisticsVisible, setLogisticsVisible] = useState({ show: false, detail: {} }); //查看物流弹窗
  const [rowKey, setRowKey] = useState([]);

  const childRef = useRef();

  // 搜索参数
  const searchItems = [
    {
      label: '订单号',
      name: 'orderSn',
    },
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
  const columns = [
    {
      title: '订单号',
      align: 'center',
      dataIndex: 'orderSn',
    },
    {
      title: '团购信息标题 跟团号',
      dataIndex: ['orderDesc', 'title'],
      render: (val) => (
        <>
          <Ellipsis length={10} tooltip>
            {`${val}`}
          </Ellipsis>
        </>
      ),
    },
    {
      title: '团长',
      align: 'center',
      dataIndex: 'orderDesc',
      render: (val) => `${val.relateOwnerName}\n${val.relateOwnerMobile}`,
    },
    {
      title: '买家',
      align: 'center',
      dataIndex: 'userInfo',
      render: (val) => `${val.userName}\n${val.mobile}\n${val.beanCode}`,
    },
    {
      title: '用户实付',
      align: 'center',
      dataIndex: 'payFee',
      render: (val, row) => {
        const cashBean = row.refundBean ? row.refundBean / 100 : 0;
        const refundPrice = Number(val) + cashBean > 0 ? (Number(val) + cashBean).toFixed(2) : 0;
        return `￥${refundPrice}\n(含${row.refundBean || 0}卡豆)`;
      },
    },
    {
      title: '退款总数量',
      dataIndex: 'orderDesc',
      render: (val) => {
        const { communityGoodsList = [] } = val;
        const total = communityGoodsList.reduce((pre, next) => {
          return pre + next.goodsCount;
        }, 0);
        return total;
      },
    },
    {
      title: '申请退款金额',
      dataIndex: 'refundFee',
      align: 'center',
      render: (val, row) => {
        const cashBean = row.refundBean ? row.refundBean / 100 : 0;
        const refundPrice = Number(val) + cashBean > 0 ? (Number(val) + cashBean).toFixed(2) : 0;
        return `￥${refundPrice}\n(含${row.refundBean || 0}卡豆)`;
      },
    },
    {
      title: '退款类型',
      dataIndex: 'refundType',
      show: ['commerceGoods', 'communityGoods'].includes(tabKey),
      render: (val) => REFUND_ORDERS_TYPE[val],
    },
    {
      title: '退款原因',
      dataIndex: 'refundReason',
    },
    {
      title: '申请时间/申请人',
      align: 'center',
      dataIndex: 'createTime',
      render: (val, row) => `${val}\n${row.applicantName || ''}`,
    },
    {
      title: '寄回状态/寄回单号',
      dataIndex: 'logisticsParam',
      align: 'center',
      show: ['commerceGoods', 'communityGoods'].includes(tabKey),
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
      title: '退款状态',
      dataIndex: 'status',
      render: (val) => ['退款中/待退款', '已退款', '取消退款'][val],
    },
    {
      title: '实际退款金额',
      dataIndex: 'refundFee',
      align: 'center',
      render: (val, row) => {
        const cashBean = row.refundBean ? row.refundBean / 100 : 0;
        const refundPrice = Number(val) + cashBean > 0 ? (Number(val) + cashBean).toFixed(2) : 0;
        return `￥${refundPrice}\n(含${row.refundBean || 0}卡豆)`;
      },
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
  // 展开table 表头
  const getColumns = (status) => [
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      render: (val, row) => {
        const { specificationData = {} } = row;
        const { specificationMap = {} } = specificationData;
        const arrKeys = Object.keys(specificationMap);
        return (
          <PopImgShow url={row.goodsImg || communityImg} onClick={row.goodsImg ? null : () => {}}>
            <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 5 }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Ellipsis length={15} tooltip>
                  {val}
                </Ellipsis>
              </div>
              {arrKeys.length && (
                <div style={{ marginTop: 5 }} className={styles.specFont}>
                  {arrKeys.map(
                    (item, index) =>
                      item !== '' && (
                        <span>{`${item}/${specificationMap[item]}${
                          index + 1 < arrKeys.length ? '，' : ''
                        }`}</span>
                      ),
                  )}
                </div>
              )}
            </div>
          </PopImgShow>
        );
      },
    },
    {
      title: '单价',
      align: 'center',
      dataIndex: 'goodsPrice',
    },
    {
      title: '购买数量',
      align: 'center',
      dataIndex: 'goodsCount',
    },
  ];
  const expandedRowRender = (columns, record) => {
    return (
      <TableDataBlock
        noCard={false}
        pagination={false}
        size="middle"
        tableSize="small"
        columns={columns(record.status)}
        list={record?.orderDesc?.communityGoodsList || []}
        rowKey={(record) => record.communityOrganizationGoodsId}
      ></TableDataBlock>
    );
  };

  return (
    <>
      <TableDataBlock
        cRef={childRef}
        loading={loading}
        columns={columns}
        searchItems={searchItems}
        rowKey={(record) => `${record.orderRefundId}`}
        params={{ orderType: tabKey }}
        dispatchType="refundOrder/fetchGetList"
        expandable={{
          expandedRowKeys: rowKey,
          onExpand: (expanded, row) => {
            if (expanded) {
              setRowKey((oldKey) => oldKey.concat(row.orderRefundId));
            } else setRowKey((oldKey) => oldKey.filter((i) => i !== row.orderRefundId));
          },
          expandedRowRender: (record) => expandedRowRender(getColumns, record),
        }}
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
    </>
  );
};

export default connect(({ refundOrder, loading }) => ({
  refundOrder,
  loadings: loading,
  loading: loading.effects['refundOrder/fetchGetList'],
}))(RefundGroupOrderList);
