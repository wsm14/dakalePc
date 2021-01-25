import React, { useState } from 'react';
import { connect } from 'umi';
import { Spin, Popover, Empty } from 'antd';
import { QrcodeOutlined, ShoppingOutlined, AccountBookOutlined } from '@ant-design/icons';
import AuthConsumer from '@/layouts/AuthConsumer';
import styles from './style.less';

const IncomeOrderDetail = ({ order, type = 'code', orderDetail, loading, dispatch }) => {
  // 打开详情请求
  const [visible, setVisible] = useState(false);

  // 获取详情
  const fetchGetDetail = () => {
    if (!visible) {
      dispatch({
        type: 'ordersList/fetchOrderDetail',
        payload: { orderId: order },
      });
    }
  };

  // 订单详情配置
  const detailProps = {
    code: {
      type: '扫码支付',
      icon: <QrcodeOutlined></QrcodeOutlined>,
      tip: '平台佣金=用户实付*平台服务费比例*平台佣金比例',
    },
    shop: {
      type: '商品核销',
      icon: <ShoppingOutlined></ShoppingOutlined>,
      tip: '平台佣金=用户实付*平台服务费比例*平台佣金比例',
    },
    coupon: {
      type: '优惠券核销',
      icon: <AccountBookOutlined></AccountBookOutlined>,
      tip: '平台佣金=用户实付*平台服务费比例*平台佣金比例',
    },
  }[type];

  const oderDom = orderDetail.id ? (
    <div className={styles.income_order}>
      <div className={styles.income_order_top}>
        <span className={styles.income_order_icon}>{detailProps.icon}</span>
        <div className={styles.income_order_name}>一点点（萧山宝龙店）</div>
        <div className={styles.income_order_title}>杨枝甘露</div>
        <div className={styles.income_order_Total}>
          平台佣金
          <label className={styles.income_order_num}>
            15<span className={styles.income_order_unit}>卡豆</span>
          </label>
          （￥0.15）
        </div>
        <span className={styles.income_order_tip}>{detailProps.tip}</span>
      </div>
      <div className={styles.income_order_detail}>
        <div className={styles.detail_item}>用户实付： ￥10.00</div>
        <div className={styles.detail_item}>平台服务费比例： 2%</div>
        <div className={styles.detail_item}>平台佣金比例： 75%（无用户/店铺家主）</div>
      </div>
      <div className={styles.income_order_bottom}>
        <div className={styles.detail_item}>订单号：DKL293839438343</div>
        <div className={styles.detail_item}>用户昵称：小黄豆</div>
        <div className={styles.detail_item}>创建时间：2020-11-10 19:09:00</div>
        <div className={styles.detail_item}>支付时间：2020-11-10 19:09:00</div>
        <div className={styles.detail_item}>核销时间：2020-11-10 19:09:00</div>
      </div>
    </div>
  ) : (
    <div style={{ height: 462 }}>
      <Empty description={false} />
    </div>
  );

  return (
    <AuthConsumer auth="info">
      <Popover
        destroyTooltipOnHide
        placement="right"
        trigger="click"
        title={`${detailProps.type} - 详情`}
        overlayStyle={{ minHeight: 462, width: 380 }}
        content={loading ? <Spin></Spin> : oderDom}
        onVisibleChange={(val) => setVisible(val)}
      >
        <a onClick={fetchGetDetail}>详情</a>
      </Popover>
    </AuthConsumer>
  );
};

export default connect(({ ordersList, loading }) => ({
  orderDetail: ordersList.orderDetail,
  loading: loading.effects['ordersList/fetchOrderDetail'],
}))(IncomeOrderDetail);
