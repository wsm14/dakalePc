import React, { useRef, useState, useEffect } from 'react';
import { useUpdateEffect } from 'ahooks';
import { connect } from 'umi';
import { Tag, message, Badge, Modal, Card } from 'antd';
import ExtraButton from '@/components/ExtraButton';
import TableDataBlock from '@/components/TableDataBlock';
import RefundModal from './RefundModal';
import PopImgShow from '@/components/PopImgShow';
import Ellipsis from '@/components/Ellipsis';
import OrderDetailDraw from '../RefundOrder/OrderDetailDraw';
import {
  REFUND_ORDERS_EXAMINE_STATUS,
  SPECIAL_GOODS_TYPE,
  ELECTRICGOODS_SELL_STATUS,
  REFUND_ORDERS_TYPE,
} from '@/common/constant';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import styles from '../../style.less';
const { confirm } = Modal;

const RefundList = (props) => {
  const { loading, RefundList = {}, dispatch, loadings } = props;

  const childRef = useRef();
  const [tabKey, setTabKey] = useState('0'); // tab
  const [refundModal, setRefundModal] = useState({ detail: {}, show: false });
  const [goodsList, setGoodsList] = useState([]); // 选择同意的商品
  const [goodsRowKeys, setGoodsRowKeys] = useState([]); //选择商品的keys
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
      // {
      //   label: '商品名称',
      //   name: 'goodsName',
      // },
      // {
      //   label: '供应商',
      //   name: 'supplierName',
      // },
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
        label: '审核结果',
        name: 'auditStatus',
        type: 'select',
        select: REFUND_ORDERS_EXAMINE_STATUS,
      },
      // {
      //   label: '商品名称',
      //   name: 'goodsName',
      // },
      // {
      //   label: '供应商',
      //   name: 'supplierName',
      // },
    ],
  }[tabKey];

  // table 表头
  const getColumns = [
    {
      title: '商品主图',
      dataIndex: 'orderDesc',
      render: (val, row) => {
        const { commerceGoods = {}, specialGoods = {}, orderType } = val;
        return (
          // <Badge.Ribbon
          //   text={
          //     {
          //       commerceGoods: ELECTRICGOODS_SELL_STATUS[commerceGoods.goodsClass],
          //       specialGoods: SPECIAL_GOODS_TYPE[[specialGoods.goodsClass]],
          //     }[orderType]
          //   }
          //   color="cyan"
          //   placement="start"
          // >
          // </Badge.Ribbon>
          <PopImgShow url={commerceGoods.goodsImg || specialGoods.goodsImg} />
        );
      },
    },
    {
      title: '商品名称/订单号',
      dataIndex: 'orderDesc',
      align: 'center',
      render: (val, row) => {
        const { commerceGoods = {}, specialGoods = {} } = val;
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
      title: '供应商',
      dataIndex: 'supplierInfo',
      render: (val) => val.supplierName,
    },
    {
      title: '下单人',
      dataIndex: 'userInfo',
      align: 'center',
      render: (val, row) => `${val.userName}\n${val.mobile}\n${row.userId}`,
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
      title: '购买数量',
      dataIndex: 'goodsCount',
    },
    {
      title: '退款数量',
      dataIndex: 'goodsCount',
    },
    {
      title: '退款金额',
      dataIndex: 'refundFee',
      align: 'center',
      render: (val, row) => {
        const cashBean = row.refundBean ? row.refundBean / 100 : 0;
        const refundPrice = Number(val) + cashBean > 0 ? (Number(val) + cashBean).toFixed(2) : 0;
        return `￥${refundPrice}\n(含${row.refundBean || 0}卡豆)`;
      },
    },
    {
      title: '申请时间',
      align: 'center',
      dataIndex: 'createTime',
      render: (val, row) => `${val}\n${row.applicantName || ''}`,
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
      title: '审核结果',
      dataIndex: 'auditStatus',
      show: ['1'].includes(tabKey),
      render: (val) => REFUND_ORDERS_EXAMINE_STATUS[val],
    },
    {
      title: '审核时间',
      dataIndex: 'verifyTime',
      show: ['1'].includes(tabKey),
    },
    {
      title: '物流状态',
      dataIndex: 'orderLogisticInfo',
      render: (val) => (val.logisticsCode ? '已发货' : '未发货'),
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
      dataIndex: 'orderRefundApplyId',
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
            visible: ['0'].includes(tabKey),
          },
          {
            type: 'agree',
            pop: true,
            click: () =>
              handleAgress([
                { orderRefundApplyId: val, orderType: row.orderType, userId: row.userId },
              ]),
            visible: ['0'].includes(tabKey),
          },
          {
            type: 'refuse',
            visible: ['0'].includes(tabKey),
            click: () =>
              setRefundModal({
                show: true,
                detail: row,
                formProps: {
                  type: 'refuse',
                  key: 'rejectReason',
                  handleClick: handleRefund,
                },
              }),
          },
        ];
      },
    },
  ];
  //拒绝退款
  const handleRefund = (values, detail) => {
    const { orderRefundApplyId, orderType, userId } = detail;
    dispatch({
      type: 'RefundList/fetchRefundRefuse',
      payload: {
        ...values,
        orderRefundApplyId,
        orderType,
        userId,
      },
      callback: () => {
        setRefundModal({ show: false, detail: {} });
        childRef.current.fetchGetData();
      },
    });
  };

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

  const handleBathAgree = () => {
    confirm({
      title: '提示',
      icon: <ExclamationCircleOutlined />,
      content: '确定同意所有的勾选申请吗',
      onOk() {
        handleAgress();
      },
      onCancel() {},
    });
  };

  //同意退款事件
  const handleAgress = (val) => {
    const list = goodsList.map((item) => {
      return {
        orderRefundApplyId: item.orderRefundApplyId,
        orderType: item.orderType,
        userId: item.userId,
      };
    });

    const idList = val ? val : list;
    if (!idList.length) {
      message.info('请选择商品');
      return false;
    }
    dispatch({
      type: 'RefundList/fetchRefundApply',
      payload: {
        orderRefundApplies: idList,
      },
      callback: () => {
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

  const btnList = [
    {
      auth: true,
      text: '批量同意',
      show: ['0'].includes(tabKey),
      onClick: () => handleBathAgree(),
    },
  ];

  return (
    <>
      <TableDataBlock
        btnExtra={btnList}
        content={
          <Card
            bordered={false}
            tabList={tabList}
            activeTabKey={tabKey}
            onTabChange={(key) => {
              setTabKey(key);
              setGoodsRowKeys([]);
            }}
          ></Card>
        }
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.orderRefundApplyId}`}
        params={{ isVerify: tabKey, orderType: 'commerceGoods' }}
        rowSelection={{
          selectedRowKeys: goodsRowKeys,
          onChange: (selectedRowKeys, selectedRows) => {
            setGoodsRowKeys(selectedRowKeys);
            setGoodsList([...selectedRows]);
          },
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
