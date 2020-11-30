import React, { useState } from 'react';
import { connect } from 'dva';
import { Spin, Popover } from 'antd';
import styles from './style.less';

const MasterOrderDetail = ({ order, orderDetail, loading, dispatch }) => {
  const [visible, setVisible] = useState(false);

  const { orderGoodsList } = orderDetail;

  // 获取详情
  const fetchGetDetail = () => {
    if (!visible)
      dispatch({
        type: 'orderDetail/fetchOrderDetail',
        payload: { orderSn: order },
      });
  };

  const oderDom = (
    <div className={styles.master_order}>
      <div className={styles.master_order_item}>
        <span className={styles.master_order_itemTitle}>订单商品：</span>
        <span className={styles.master_order_itemContent}>
          {orderDetail.orderGoodsList && orderGoodsList.goodsName}
        </span>
      </div>
      <div className={styles.master_order_item}>
        <span className={styles.master_order_itemTitle}>消费店铺：</span>
        <span className={styles.master_order_itemContent}>{orderDetail.merchantName}</span>
      </div>
      <div className={styles.master_order_item}>
        <span className={styles.master_order_itemTitle}>消费用户：</span>
        <span className={styles.master_order_itemContent}>{orderDetail.userName}</span>
      </div>
      <div className={styles.master_order_item} style={{ marginTop: 15 }}>
        <span className={styles.master_order_itemTitle}>交易金额：</span>
        <span className={styles.master_order_itemContent}>￥{orderDetail.totalFee}</span>
      </div>
      <div className={styles.master_order_item}>
        <span className={styles.master_order_itemTitle}>卡豆抵扣：</span>
        <span className={styles.master_order_itemContent}>
          {orderDetail.beanFee}卡豆（-￥{orderDetail.beanFee / 100}）
        </span>
      </div>
      <div className={styles.master_order_item}>
        <span className={styles.master_order_itemTitle}>优惠券：</span>
        <span className={styles.master_order_itemContent}>
          {orderDetail.deductFee}元抵扣券（-￥{orderDetail.deductFee}）
        </span>
      </div>
      <div className={styles.master_order_item} style={{ marginTop: 15 }}>
        <span className={styles.master_order_itemTitle}>实际支付：</span>
        <span className={styles.master_order_itemContent}>￥{orderDetail.payFee}</span>
      </div>
      <div className={styles.master_order_item}>
        <span className={styles.master_order_itemTitle}>订单号：</span>
        <span className={styles.master_order_itemContent}>{orderDetail.orderSn}</span>
      </div>
      <div className={styles.master_order_item}>
        <span className={styles.master_order_itemTitle}>付款时间：</span>
        <span className={styles.master_order_itemContent}>{orderDetail.payTime}</span>
      </div>
    </div>
  );

  return order ? (
    <Popover
      destroyTooltipOnHide
      placement="right"
      trigger="click"
      title="订单详情"
      overlayStyle={{ height: 284, maxWidth: 300 }}
      content={loading ? <Spin></Spin> : oderDom}
      onVisibleChange={(val) => setVisible(val)}
    >
      <a onClick={fetchGetDetail}>{order}</a>
    </Popover>
  ) : (
    '--'
  );
};

export default connect(({ orderDetail, loading }) => ({
  orderDetail: orderDetail.orderDetail,
  loading: loading.effects['orderDetail/fetchOrderDetail'],
}))(MasterOrderDetail);
