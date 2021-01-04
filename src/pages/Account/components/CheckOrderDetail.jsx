import React, { useState } from 'react';
import { connect } from 'umi';
import { Spin, Popover } from 'antd';
import styles from './style.less';

const CheckOrderDetail = ({ order, orderDetail, loading, dispatch }) => {
  const [visible, setVisible] = useState(false);

  // 获取详情
  const fetchGetDetail = () => {
    if (!visible)
      dispatch({
        type: 'orderDetail/fetchOrderDetail',
        payload: { orderSn: order },
      });
  };

  const oderDom = (
    <div className={styles.relevance_order} style={{ height: 180 }}>
      <div className={styles.relevance_order_item}>
        <span className={styles.relevance_order_itemTitle}>订单号：</span>
        <span className={styles.relevance_order_itemContent}>{orderDetail.orderSn}</span>
      </div>
      <div className={styles.relevance_order_item}>
        <span className={styles.relevance_order_itemTitle}>订单状态：</span>
        <span className={styles.relevance_order_itemContent}>已完成</span>
      </div>
      <div className={styles.relevance_order_item}>
        <span className={styles.relevance_order_itemTitle}>消费商家：</span>
        <span className={styles.relevance_order_itemContent}>{orderDetail.merchantName}</span>
      </div>
      <div className={styles.relevance_order_item} style={{ marginTop: 15 }}>
        <span className={styles.relevance_order_itemTitle}>订单完成时间：</span>
        <span className={styles.relevance_order_itemContent}>{orderDetail.payTime}</span>
      </div>
      <div className={styles.relevance_order_item} style={{ marginTop: 15 }}>
        <span className={styles.relevance_order_itemTitle}>消费金额：</span>
        <span className={styles.relevance_order_itemContent}>{orderDetail.totalFee}元</span>
      </div>
      <div className={styles.relevance_order_item}>
        <span className={styles.relevance_order_itemTitle}>卡豆抵扣：</span>
        <span className={styles.relevance_order_itemContent}>
          {orderDetail.beanFee / 100}元（{orderDetail.beanFee}卡豆）
        </span>
      </div>
    </div>
  );

  return order ? (
    <Popover
      destroyTooltipOnHide
      placement="right"
      trigger="click"
      title="关联订单"
      overlayStyle={{ height: 250, maxWidth: 300, minWidth: 250 }}
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
}))(CheckOrderDetail);
