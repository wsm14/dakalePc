import React, { useState } from 'react';
import { connect } from 'dva';
import { Spin, Popover } from 'antd';
import { PAY_TYPE } from '@/common/constant';
import styles from './style.less';

const MasterOrderDetail = ({ order, name, orderDetail, loading, dispatch }) => {
  const [visible, setVisible] = useState(false);

  // 获取详情
  const fetchGetDetail = () => {
    if (!visible)
      dispatch({
        type: 'ordersList/fetchOrderDetail',
        payload: { orderId: order },
      });
  };

  const oderDom = (
    <div className={styles.master_order}>
      {name && (
        <div className={styles.master_order_item}>
          <span className={styles.master_order_itemTitle}>订单商品：</span>
          <span className={styles.master_order_itemContent}>{name}</span>
        </div>
      )}
      <div className={styles.master_order_item}>
        <span className={styles.master_order_itemTitle}>店铺名称：</span>
        <span className={styles.master_order_itemContent}>{orderDetail.merchantName}</span>
      </div>
      <div className={styles.master_order_item}>
        <span className={styles.master_order_itemTitle}>店铺地址：</span>
        <span className={styles.master_order_itemContent}>{orderDetail.address}</span>
      </div>
      <div className={styles.master_order_item} style={{ marginTop: 15 }}>
        <span className={styles.master_order_itemTitle}>订单金额：</span>
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
          {orderDetail.deductFee || 0}元抵扣券（-￥{orderDetail.deductFee || 0}）
        </span>
      </div>
      <div className={styles.master_order_item}>
        <span className={styles.master_order_itemTitle}>实付金额：</span>
        <span className={styles.master_order_itemContent}>￥{orderDetail.payFee || 0}</span>
      </div>
      <div className={styles.master_order_item} style={{ marginTop: 15 }}>
        <span className={styles.master_order_itemTitle}>订单号：</span>
        <span className={styles.master_order_itemContent}>{orderDetail.orderSn}</span>
      </div>
      <div className={styles.master_order_item}>
        <span className={styles.master_order_itemTitle}>支付方式：</span>
        <span className={styles.master_order_itemContent}>{PAY_TYPE[orderDetail.payType]}</span>
      </div>
      <div className={styles.master_order_item}>
        <span className={styles.master_order_itemTitle}>创建时间：</span>
        <span className={styles.master_order_itemContent}>{orderDetail.createTime}</span>
      </div>
      <div className={styles.master_order_item}>
        <span className={styles.master_order_itemTitle}>支付时间：</span>
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
      overlayStyle={{ height: 284, width: 300 }}
      content={loading ? <Spin></Spin> : oderDom}
      onVisibleChange={(val) => setVisible(val)}
    >
      <a onClick={fetchGetDetail}>查看详情</a>
    </Popover>
  ) : (
    '--'
  );
};

export default connect(({ ordersList, loading }) => ({
  orderDetail: ordersList.orderDetail,
  loading: loading.effects['ordersList/fetchOrderDetail'],
}))(MasterOrderDetail);
