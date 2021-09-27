import React from 'react';
import { Popover } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import {
  QrcodeOutlined,
  ShoppingOutlined,
  AccountBookOutlined,
  PlaySquareOutlined,
} from '@ant-design/icons';
import styles from './style.less';

const IncomeOrderDetail = ({ visible, onClose }) => {
  const { show = false, type = 'scan', detail = {}, bean = 0 } = visible;

  // 公式计算dom
  const formulaDom = (title = '服务费=店铺实收*服务费比例', footTip) => (
    <div style={{ lineHeight: 2.5 }}>
      <div>{title}</div>
      <span style={{ color: '#00000069' }}>
        区县分佣=服务费*20%
        <br />
        省公司分佣=服务费*5%
        <br />
        用户家主分佣=服务费*10%（无家主时分摊到平台）
        <br />
        店铺家主分佣=服务费*5%（无家主时分摊到平台）
        {footTip}
      </span>
    </div>
  );

  // 哒人带货分佣说明
  const kolFormDom = () => (
    <div style={{ lineHeight: 2.5 }}>
      <div>商品佣金=用户实付-店铺实收</div>
      <span style={{ color: '#00000069' }}>
        区县分佣=商品佣金*34%*20%
        <br />
        省公司分佣=商品佣金*34%*5%
        <br />
        用户家主分佣=商品佣金*34%*10%（无家主时分摊到平台）
        <br />
        店铺家主分佣=商品佣金*34%*5%（无家主时分摊到平台）
        <br />
        推广者分佣=商品佣金*推广者等级分佣比例
        <br />
        豆长团队分佣=商品佣金*豆长团队分佣比例
      </span>
    </div>
  );

  // 订单详情配置
  const detailProps = {
    scan: {
      type: '扫码支付',
      icon: <QrcodeOutlined />,
      merchantName: false,
      titleKey: 'merchantName',
      formulaDom,
    },
    writeOff: {
      type: '核销订单',
      icon: <ShoppingOutlined />,
      merchantName: true,
      titleKey: 'goodsName',
      kolFormDom,
    },
    goods: {
      type: '商品核销',
      icon: <ShoppingOutlined />,
      merchantName: true,
      titleKey: 'goodsName',
    },
    specialGoods: {
      type: '特价商品订单',
      icon: <ShoppingOutlined />,
      merchantName: true,
      titleKey: 'goodsName',
      kolFormDom,
    },
    kolGoods: {
      type: '哒人带货订单',
      icon: <ShoppingOutlined />,
      merchantName: true,
      titleKey: 'goodsName',
      kolFormDom,
    },
    reduceCoupon: {
      type: '抵扣券核销',
      icon: <AccountBookOutlined />,
      merchantName: true,
      titleKey: 'couponName',
      kolFormDom,
    },
    marketCoupon: {
      type: '兑换券订单',
      icon: <AccountBookOutlined />,
      merchantName: true,
      titleKey: 'couponName',
      formulaDom,
    },
    moment: {
      type: '看分享',
      icon: <PlaySquareOutlined />,
      merchantName: false,
      titleKey: 'merchantName',
      formulaDom: () => formulaDom('推广费=店铺结算卡豆*推广费比例'),
    },
  }[type];

  const oderDom = (
    <div className={styles.income_order}>
      <div className={styles.income_order_top}>
        <span className={styles.income_order_icon}>{detailProps.icon}</span>
        {detailProps.merchantName && (
          <div className={styles.income_order_name}>{detail.merchantName}</div>
        )}
        <div className={styles.income_order_title}>
          {detail.couponName || detail[detailProps.titleKey]}
        </div>
        <div className={styles.income_order_Total}>
          平台佣金
          <label className={styles.income_order_num}>
            {bean}
            <span className={styles.income_order_unit}>卡豆</span>
          </label>
          （￥{bean / 100}）
        </div>
        <span className={styles.income_order_tip}>
          {/* 哒人带货商品显示字段 */}
          {type === 'kolGoods' ||
          type === 'reduceCoupon' ||
          type === 'specialGoods' ||
          type === 'writeOff'
            ? '平台佣金=商品佣金-区县分佣-省公司分佣-用户家主分佣-店铺家主分佣-哒人带货分佣-豆长团队分佣'
            : '平台佣金=店铺服务费-区县分佣-省公司分佣-用户家主分佣-店铺家主分佣'}
        </span>
      </div>
      <div className={styles.income_order_detail}>
        {/* 哒人带货,优惠券商品显示字段 */}
        {(type === 'kolGoods' ||
          type === 'reduceCoupon' ||
          type === 'specialGoods' ||
          type === 'writeOff') && (
          <>
            <div className={styles.detail_item}>用户实付：￥{detail.payFee || 0}</div>
            <div className={styles.detail_item}>店铺实收：￥{detail.totalFee || 0}</div>
            <div className={styles.detail_item}>商品佣金：￥{detail.totalCommission || 0}</div>
          </>
        )}
        {type !== 'kolGoods' &&
          type !== 'reduceCoupon' &&
          type !== 'specialGoods' &&
          type !== 'writeOff' && (
            <>
              <div className={styles.detail_item}>店铺实收：￥{detail.totalFee || 0}</div>
              <div className={styles.detail_item}>服务费比例：{detail.commissionRatio || 0}%</div>
              <div className={styles.detail_item}>
                店铺服务费：{detail.merchantServiceBean || 0}卡豆
              </div>
            </>
          )}
        <div className={styles.detail_item_class}>
          区县分佣：{detail.partnerProfitBean || 0}卡豆
        </div>
        <div className={styles.detail_item_class}>
          省公司分佣：{detail.provinceProfitBean || 0}卡豆
        </div>
        <div className={styles.detail_item_class}>
          用户家主分佣：{detail.userParentProfitBean || 0}卡豆
        </div>
        <div className={styles.detail_item_class}>
          店铺家主分佣：{detail.merchantParentProfitBean || 0}卡豆
        </div>
        {/* 哒人带货,优惠券商品显示字段 */}
        {(type === 'kolGoods' ||
          type === 'reduceCoupon' ||
          type === 'specialGoods' ||
          type === 'writeOff') && (
          <>
            <div className={styles.detail_item_class}>
              哒人带货分佣：{detail.kolProfitBean || 0}卡豆 （分佣比例：{detail.kolProfitProportion}
              ）
            </div>
            <div className={styles.detail_item_class}>
              豆长团队分佣：{detail.teamProfitBean || 0}卡豆 (分佣比例：
              {detail.teamProfitProportion})
            </div>
          </>
        )}
        <div className={styles.detail_item_formula}>
          {type === 'kolGoods' ||
          type === 'reduceCoupon' ||
          type === 'specialGoods' ||
          type === 'writeOff' ? (
            <></>
            // <Popover content={detailProps.kolFormDom()} placement="left">
            //   <a>查看计算公式</a>
            // </Popover>
          ) : (
            <Popover content={detailProps.formulaDom()} placement="left">
              <a>查看计算公式</a>
            </Popover>
          )}
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
