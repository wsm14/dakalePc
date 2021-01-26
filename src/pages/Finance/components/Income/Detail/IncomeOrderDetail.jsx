import React, { useState } from 'react';
import { connect } from 'umi';
import { Spin, Popover, Empty } from 'antd';
import {
  QrcodeOutlined,
  ShoppingOutlined,
  AccountBookOutlined,
  PlaySquareOutlined,
} from '@ant-design/icons';
import AuthConsumer from '@/layouts/AuthConsumer';
import styles from './style.less';

const IncomeOrderDetail = ({ identification, type = 'scan', orderDetail, loading, dispatch }) => {
  // 打开详情请求
  const [visible, setVisible] = useState(false);

  // 获取详情
  const fetchGetDetail = () => {
    if (!visible) {
      dispatch({
        type: 'platformIncome/fetchPlatformInconmeDetail',
        payload: { identification, source: 'platform' },
      });
    }
  };

  // 订单详情配置
  const detailProps = {
    scan: {
      type: '扫码支付',
      icon: <QrcodeOutlined />,
      tip: '平台佣金=用户实付*平台服务费比例*平台佣金比例',
      titleKey: 'merchantName',
    },
    goods: {
      type: '商品核销',
      icon: <ShoppingOutlined />,
      tip: '平台佣金=用户实付*平台服务费比例*平台佣金比例',
      titleKey: 'name',
    },
    reduceCoupon: {
      type: '抵扣券核销',
      icon: <AccountBookOutlined />,
      tip: '平台佣金=用户实付*平台服务费比例*平台佣金比例',
      titleKey: 'name',
    },
    moment: {
      type: '看分享',
      icon: <PlaySquareOutlined />,
      tip: '平台佣金=用户实付*平台服务费比例*平台佣金比例',
      titleKey: 'merchantName',
    },
  }[type];

  const oderDom = orderDetail.orderId ? (
    <div className={styles.income_order}>
      <div className={styles.income_order_top}>
        <span className={styles.income_order_icon}>{detailProps.icon}</span>
        {!orderDetail.name && (
          <div className={styles.income_order_name}>{orderDetail.merchantName}</div>
        )}
        <div className={styles.income_order_title}>{orderDetail[detailProps.titleKey]}</div>
        <div className={styles.income_order_Total}>
          平台佣金
          <label className={styles.income_order_num}>
            {orderDetail.platformBean * 100 || 0}
            <span className={styles.income_order_unit}>卡豆</span>
          </label>
          （￥{orderDetail.platformBean || 0}）
        </div>
        <span className={styles.income_order_tip}>{detailProps.tip}</span>
      </div>
      <div className={styles.income_order_detail}>
        <div className={styles.detail_item}>用户实付： ￥{orderDetail.totalFee || 0}</div>
        <div className={styles.detail_item}>
          平台服务费比例： {orderDetail.commissionRatio || 0}%
        </div>
        <div className={styles.detail_item}>
          平台佣金比例： {orderDetail.rebate || 0}%（无用户/店铺家主）
        </div>
      </div>
      <div className={styles.income_order_bottom}>
        <div className={styles.detail_item}>订单号：{orderDetail.orderSn}</div>
        <div className={styles.detail_item}>用户昵称：{orderDetail.userName}</div>
        <div className={styles.detail_item}>创建时间：{orderDetail.createTime}</div>
        <div className={styles.detail_item}>支付时间：{orderDetail.payTime}</div>
        {orderDetail.verificationTime && (
          <div className={styles.detail_item}>核销时间：{orderDetail.verificationTime}</div>
        )}
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

export default connect(({ platformIncome, loading }) => ({
  orderDetail: platformIncome.orderDetail,
  loading: loading.effects['ordersList/fetchOrderDetail'],
}))(IncomeOrderDetail);
