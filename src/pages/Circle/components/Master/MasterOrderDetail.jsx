import React, { useState } from 'react';
import { connect } from 'dva';
import { Spin, Popover } from 'antd';
import styles from '../style.less';

const MasterOrderDetail = ({ order, orderDetail, loading, dispatch }) => {
  const [visible, setVisible] = useState(false);

  // 获取详情
  const fetchGetDetail = () => {
    if (!visible)
      dispatch({
        type: 'circleMaster/fetchGetOrderDetails',
      });
  };

  const oderDom = (
    <div className={styles.master_order}>
      <div className={styles.master_order_item}>
        <span className={styles.master_order_itemTitle}>订单商品：</span>
        <span className={styles.master_order_itemContent}>{orderDetail.name}</span>
      </div>
      <div className={styles.master_order_item}>
        <span className={styles.master_order_itemTitle}>消费店铺：</span>
        <span className={styles.master_order_itemContent}>{orderDetail.name}</span>
      </div>
      <div className={styles.master_order_item}>
        <span className={styles.master_order_itemTitle}>消费用户：</span>
        <span className={styles.master_order_itemContent}>{orderDetail.name}</span>
      </div>
      <div className={styles.master_order_item} style={{ marginTop: 15 }}>
        <span className={styles.master_order_itemTitle}>交易金额：</span>
        <span className={styles.master_order_itemContent}>￥{orderDetail.name}</span>
      </div>
      <div className={styles.master_order_item}>
        <span className={styles.master_order_itemTitle}>卡豆抵扣：</span>
        <span className={styles.master_order_itemContent}>{orderDetail.name}卡豆（-￥{orderDetail.name}）</span>
      </div>
      <div className={styles.master_order_item}>
        <span className={styles.master_order_itemTitle}>优惠券：</span>
        <span className={styles.master_order_itemContent}>{orderDetail.name}元抵扣券（-￥{orderDetail.name}）</span>
      </div>
      <div className={styles.master_order_item} style={{ marginTop: 15 }}>
        <span className={styles.master_order_itemTitle}>实际支付：</span>
        <span className={styles.master_order_itemContent}>￥{orderDetail.name}</span>
      </div>
      <div className={styles.master_order_item}>
        <span className={styles.master_order_itemTitle}>订单号：</span>
        <span className={styles.master_order_itemContent}>{orderDetail.name}</span>
      </div>
      <div className={styles.master_order_item}>
        <span className={styles.master_order_itemTitle}>付款时间：</span>
        <span className={styles.master_order_itemContent}>{orderDetail.name}</span>
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

export default connect(({ circleMaster, loading }) => ({
  orderDetail: circleMaster.orderDetail,
  loading: loading.effects['circleMaster/fetchGetOrderDetails'],
}))(MasterOrderDetail);
