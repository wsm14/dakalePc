import React, { useRef, useState, useEffect } from 'react';
import { useUpdateEffect } from 'ahooks';
import { connect } from 'umi';
import { Card } from 'antd';
import TableDataBlock from '@/components/TableDataBlock';
import RefundModal from './RefundModal';
import PopImgShow from '@/components/PopImgShow';
import Ellipsis from '@/components/Ellipsis';
import OrderDetailDraw from '../RefundOrder/OrderDetailDraw';
import { REFUND_ORDERS_EXAMINE_STATUS, REFUND_ORDERS_TYPE, ORDERS_STATUS } from '@/common/constant';
import communityImg from '@public/community.png';
import styles from '../../style.less';

const RefundList = (props) => {
  const { loading, RefundList = {}, dispatch, loadings } = props;

  const childRef = useRef();
  const [tabKey, setTabKey] = useState('0'); // tab
  const [refundModal, setRefundModal] = useState({ detail: {}, show: false });
  const [rowKey, setRowKey] = useState([]);
  const [infoVisible, setinfoVisible] = useState(false);
  useUpdateEffect(() => {
    childRef.current && childRef.current.fetchGetData({ isVerify: tabKey });
  }, [tabKey]);
  // tab栏列表
  const tabList = [
    {
      key: '0',
      tab: '待审核',
    },
    {
      key: '1',
      tab: '已审核',
    },
  ];

  // 搜索参数
  const searchItems = {
    0: [
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
        label: '退款类型',
        name: 'refundType',
        type: 'select',
        select: REFUND_ORDERS_TYPE,
      },
    ],
    1: [
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
        label: '团长',
        name: 'ownerId',
        type: 'user',
      },
      {
        label: '退款类型',
        name: 'refundType',
        type: 'select',
        select: REFUND_ORDERS_TYPE,
      },

      {
        label: '审核状态',
        name: 'auditStatus',
        type: 'select',
        select: REFUND_ORDERS_EXAMINE_STATUS,
      },
    ],
  }[tabKey];

  //table 表头
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
      title: '审核状态',
      dataIndex: 'auditStatus',
      show: ['1'].includes(tabKey),
      render: (val) => REFUND_ORDERS_EXAMINE_STATUS[val],
    },
    {
      title: '审核时间',
      dataIndex: 'verifyTime',
      align: 'center',
      show: ['1'].includes(tabKey),
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
      align: 'center',
      dataIndex: 'orderRefundApplyId',
      render: (val, row, index) => [
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
          visible: ['0'].includes(tabKey),
        },
      ],
    },
  ];

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
  //备注
  const handleRemark = (values, detail) => {
    const { orderRefundApplyId, userId } = detail;
    dispatch({
      type: 'RefundList/fetchRefundRemark',
      payload: {
        ...values,
        orderRefundApplyId: orderRefundApplyId,
        userId,
      },
      callback: () => {
        setRefundModal({ show: false, detail: {} });
        childRef.current.fetchGetData();
      },
    });
  };

  //获取详情
  const fetchRefundDetail = (index) => {
    const { list = [] } = RefundList;
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
        content={
          <Card
            bordered={false}
            tabList={tabList}
            activeTabKey={tabKey}
            onTabChange={(key) => {
              setTabKey(key);
            }}
          ></Card>
        }
        cRef={childRef}
        loading={loading}
        columns={columns}
        searchItems={searchItems}
        rowKey={(record) => `${record.orderRefundApplyId}`}
        params={{ isVerify: tabKey, orderType: 'communityGoods' }}
        expandable={{
          expandedRowKeys: rowKey,
          onExpand: (expanded, row) => {
            if (expanded) {
              setRowKey((oldKey) => oldKey.concat(row.orderRefundApplyId));
            } else setRowKey((oldKey) => oldKey.filter((i) => i !== row.orderRefundApplyId));
          },
          expandedRowRender: (record) => expandedRowRender(getColumns, record),
        }}
        dispatchType="RefundList/fetchGetList"
        {...RefundList}
      ></TableDataBlock>
      {/* 拒绝弹窗 */}
      <RefundModal
        visible={refundModal}
        onClose={() => setRefundModal({ show: false, detail: {} })}
      ></RefundModal>
      {/* 详情页面 */}
      <OrderDetailDraw
        childRef={childRef}
        visible={infoVisible}
        total={RefundList?.list.length}
        tabkey={tabKey}
        loading={loadings.effects['ordersList/fetchGetOrderDetail']}
        getDetail={fetchRefundDetail}
        onClose={() => {
          setinfoVisible(false);
        }}
      ></OrderDetailDraw>
    </>
  );
};

export default connect(({ RefundList, loading }) => ({
  loadings: loading,
  RefundList: RefundList.list,
  loading: loading.effects['RefundList/fetchGetList'],
}))(RefundList);
