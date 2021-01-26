import React from 'react';
import DrawerCondition from '@/components/DrawerCondition';
import {
  QrcodeOutlined,
  ShoppingOutlined,
  AccountBookOutlined,
  PlaySquareOutlined,
} from '@ant-design/icons';
import styles from './style.less';

const IncomeOrderDetail = ({ visible, onClose }) => {
  const { show = false, type = 'scan', detail = {} } = visible;

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
      titleKey: 'goodsName',
    },
    specialGoods: {
      type: '特价商品订单',
      icon: <ShoppingOutlined />,
      tip: '平台佣金=用户实付*平台服务费比例*平台佣金比例',
      titleKey: 'goodsName',
    },
    reduceCoupon: {
      type: '抵扣券核销',
      icon: <AccountBookOutlined />,
      tip: '平台佣金=用户实付*平台服务费比例*平台佣金比例',
      titleKey: 'couponName',
    },
    marketCoupon: {
      type: '兑换券订单',
      icon: <AccountBookOutlined />,
      tip: '平台佣金=用户实付*平台服务费比例*平台佣金比例',
      titleKey: 'couponName',
    },
    moment: {
      type: '看分享',
      icon: <PlaySquareOutlined />,
      tip: '平台佣金=用户实付*平台服务费比例*平台佣金比例',
      titleKey: 'merchantName',
    },
  }[type];

  const oderDom = (
    <div className={styles.income_order}>
      <div className={styles.income_order_top}>
        <span className={styles.income_order_icon}>
          {detailProps[type] ? detailProps.icon : <ShoppingOutlined />}
        </span>
        {!detail[detailProps.titleKey] && (
          <div className={styles.income_order_name}>{detail.merchantName}</div>
        )}
        <div className={styles.income_order_title}>{detail[detailProps.titleKey]}</div>
        <div className={styles.income_order_Total}>
          平台佣金
          <label className={styles.income_order_num}>
            {detail.platformBean * 100 || 0}
            <span className={styles.income_order_unit}>卡豆</span>
          </label>
          （￥{detail.platformBean || 0}）
        </div>
        <span className={styles.income_order_tip}>{detailProps.tip}</span>
      </div>
      <div className={styles.income_order_detail}>
        <div className={styles.detail_item}>用户实付： ￥{detail.totalFee || 0}</div>
        <div className={styles.detail_item}>平台服务费比例： {detail.commissionRatio || 0}%</div>
        <div className={styles.detail_item}>
          平台佣金比例： {detail.rebate || 0}%（无用户/店铺家主）
        </div>
      </div>
      <div className={styles.income_order_bottom}>
        <div className={styles.detail_item}>订单号：{detail.orderSn}</div>
        <div className={styles.detail_item}>用户昵称：{detail.userName}</div>
        <div className={styles.detail_item}>创建时间：{detail.createTime}</div>
        <div className={styles.detail_item}>支付时间：{detail.payTime}</div>
        {detail.verificationTime && (
          <div className={styles.detail_item}>核销时间：{detail.verificationTime}</div>
        )}
      </div>
    </div>
  );

  // 弹出窗属性
  const modalProps = {
    title: `${detailProps.type} - 详情`,
    visible: show,
    onClose,
  };

  return <DrawerCondition {...modalProps}>{oderDom}</DrawerCondition>;
};

export default IncomeOrderDetail;
