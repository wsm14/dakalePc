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

  // 平台收益对应类型
  const rebate_type = {
    60: '（有用户/店铺家主）',
    65: '（有用户/无店铺家主）',
    70: '（无用户/有店铺家主）',
    75: '（无用户/店铺家主）',
  };

  // 订单详情配置
  const detailProps = {
    scan: {
      type: '扫码支付',
      icon: <QrcodeOutlined />,
      titleKey: 'merchantName',
    },
    goods: {
      type: '商品核销',
      icon: <ShoppingOutlined />,
      titleKey: 'goodsName',
    },
    specialGoods: {
      type: '特价商品订单',
      icon: <ShoppingOutlined />,
      titleKey: 'goodsName',
    },
    kolGoods: {
      type: '哒人带货订单',
      icon: <ShoppingOutlined />,
      titleKey: 'goodsName',
    },
    reduceCoupon: {
      type: '抵扣券核销',
      icon: <AccountBookOutlined />,
      titleKey: 'couponName',
    },
    marketCoupon: {
      type: '兑换券订单',
      icon: <AccountBookOutlined />,
      titleKey: 'couponName',
    },
    moment: {
      type: '看分享',
      icon: <PlaySquareOutlined />,
      titleKey: 'merchantName',
    },
  }[type];

  const oderDom = (
    <div className={styles.income_order}>
      <div className={styles.income_order_top}>
        <span className={styles.income_order_icon}>
          {detailProps.icon ? detailProps.icon : <ShoppingOutlined />}
        </span>
        {!detail[detailProps.titleKey] && (
          <div className={styles.income_order_name}>{detail.merchantName}</div>
        )}
        <div className={styles.income_order_title}>{detail[detailProps.titleKey]}</div>
        <div className={styles.income_order_Total}>
          平台佣金
          <label className={styles.income_order_num}>
            {detail.platformBean}
            <span className={styles.income_order_unit}>卡豆</span>
          </label>
          （￥{detail.platformBean / 100 || 0}）
        </div>
        <span className={styles.income_order_tip}>
          平台佣金=店铺服务费-区县分佣-省公司分佣-用户家主分佣-店铺家主分佣
        </span>
      </div>
      <div className={styles.income_order_detail}>
        <div className={styles.detail_item}>用户实付： ￥{detail.totalFee || 0}</div>
        <div className={styles.detail_item}>平台服务费比例： {detail.commissionRatio || 0}%</div>
        <div className={styles.detail_item}>
          平台佣金比例： {detail.rebate || 0}%{rebate_type[detail.rebate]}
        </div>
        <div className={styles.detail_item}>
          <a>查看计算公式</a>
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
