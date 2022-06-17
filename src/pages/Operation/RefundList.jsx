import React, { useRef, useState, useEffect } from 'react';
import { useUpdateEffect } from 'ahooks';
import { connect } from 'umi';
import { Tag, message } from 'antd';
import ExtraButton from '@/components/ExtraButton';
import TableDataBlock from '@/components/TableDataBlock';
import RefundModal from './components/RefundList/RefundModal';
import PopImgShow from '@/components/PopImgShow';
import Ellipsis from '@/components/Ellipsis';
import OrderDetailDraw from './components/Orders/OrderDetailDraw';
import {
  GOODS_CLASS_TYPE,
  TAG_COLOR_TYPE,
  BUSINESS_TYPE,
  REFUND_ORDERS_EXAMINE_STATUS,
} from '@/common/constant';
import { checkCityName } from '@/utils/utils';
import moment from 'moment';

const RefundList = (props) => {
  const { loading, RefundList = {}, dispatch, loadings } = props;

  const childRef = useRef();
  const [tabKey, setTabKey] = useState('0'); // tab
  const [refundModal, setRefundModal] = useState({ detail: {}, show: false });
  const [goodsList, setGoodsList] = useState([]); // 选择同意的商品
  const [infoVisible, setinfoVisible] = useState(false);
  useUpdateEffect(() => {
    childRef.current && childRef.current.fetchGetData();
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
        label: '商品名称',
        name: 'supplierName',
      },
      {
        label: '供应商',
        name: 'supplierName',
      },
    ],
    1: [
      {
        label: '订单号',
        name: 'orderId',
      },
      {
        label: '下单人',
        name: 'userId',
        type: 'user',
      },
      {
        label: '商品名称',
        name: 'supplierName',
      },
      {
        label: '供应商',
        name: 'supplierName',
      },
    ],
  }[tabKey];

  // table 表头
  const getColumns = [
    {
      title: '商品主图',
      dataIndex: 'refundImg',
      render: (val, row) => <PopImgShow url={val} />,
    },
    {
      title: '商品名称/订单号',
      dataIndex: 'goodsName',
      align: 'center',
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
      title: '供应商',
      dataIndex: 'applicantName',
    },
    {
      title: '下单人',
      dataIndex: 'applicantName',
      align: 'center',
      render: (val, row) => `${val}\n${val}\n${row.beanCode}`,
    },
    {
      title: '用户实付',
      align: 'center',
      dataIndex: 'settleTotalFee',
      render: (val, record) => (
        <div style={{ textAlign: 'center' }}>
          <div>{`￥${val}`}</div>
          <div className={styles.fontColor}>
            {record.settleBeanFee ? `(${record.settleBeanFee}卡豆` : '(' + '0卡豆'}
          </div>
          <div className={styles.fontColor}>
            {(record.settlePayFee ? `+ ￥${record.settlePayFee}` : 0) + ')'}
          </div>
        </div>
      ),
    },
    {
      title: '购买数量',
      dataIndex: 'goodsCount',
    },
    {
      title: '退款数量',
      dataIndex: 'refundCount',
    },
    {
      title: '退款金额',
      dataIndex: 'refundTotalFee',
      align: 'center',
      render: () => (val, row) => `${val}\n(含${row.refundBean || 0}卡豆)`,
    },
    {
      title: '申请时间',
      align: 'center',
      dataIndex: 'createTime',
      render: (val, row) => `${val}\n${row.applicantName || ''}`,
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
      dataIndex: 'orderSn',
    },
    {
      title: '备注',
      dataIndex: 'remarks',
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
            type: 'remarks',
            click: () => setRefundModal({ show: true, formProps: { type: 'remark' } }),
          },
          {
            type: 'agree',
            pop: true,
            click: () => handleAgress(val),
          },
          {
            type: 'refuse',
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
  const handleRefund = (values) => {
    const { orderRefundApplyId } = refundModal.detail;
    dispatch({
      type: 'RefundList/fetchRefundRefuse',
      payload: {
        ...values,
        orderRefundApplyId,
      },
      callback: () => {
        setRefundModal({ show: false, detail: {} });
        childRef.current.fetchGetData();
      },
    });
  };

  //同意退款事件
  const handleAgress = (val) => {
    const id = val ? val.split(',') : goodsList;
    if (!id.length) {
      message.info('请选择商品');
      return false;
    }
    dispatch({
      type: 'RefundList/fetchRefundApply',
      payload: {
        orderRefundApplyIds: id,
      },
      callback: () => {
        childRef.current.fetchGetData();
      },
    });
  };

  //获取详情
  const fetchRefundDetail = (index) => {
    const { list = [] } = RefundList;
    const { orderRefundApplyId } = list[index];
    dispatch({
      type: 'RefundList/fetchRefundRrderDetail',
      payload: {
        orderRefundApplyId,
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
      onClick: () => handleAgress(),
    },
  ];

  return (
    <>
      <TableDataBlock
        cardProps={{
          tabList: tabList,
          activeTabKey: tabKey,
          onTabChange: setTabKey,
          tabBarExtraContent: <ExtraButton list={btnList}></ExtraButton>,
        }}
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.orderRefundApplyId}`}
        params={{ isVerify: tabKey }}
        rowSelection={{
          onChange: setGoodsList,
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
        loading={loadings.effects['RefundList/fetchRefundRrderDetail']}
        getDetail={fetchRefundDetail}
      ></OrderDetailDraw>
    </>
  );
};

export default connect(({ RefundList, loading }) => ({
  loadings: loading,
  RefundList: RefundList.list,
  loading: loading.effects['RefundList/fetchGetList'],
}))(RefundList);
