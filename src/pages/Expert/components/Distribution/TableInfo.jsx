import { Tag, Badge } from 'antd';
import {
  EXPRET_DISTRIBUTION_TYPE,
  EXPRET_DISTRIBUTION_OWN_TYPE,
  EXPRET_DISTRIBUTION_STATUS,
  EXPRET_DISTRIBUTION_PAY_STATUS,
} from '@/common/constant';
import PopImgShow from '@/components/PopImgShow';
import Ellipsis from '@/components/Ellipsis';
import coupon from './coupon.png';
import styles from './style.less';

// 订单信息
export const OrderInfo = ({ data }) => {
  const {
    goodsImg,
    settlementTime,
    merchantName,
    settlementFee = 0,
    goodsName,
    orderSn,
    orderType,
    orderStatus,
  } = data;

  const imgShow = (
    <PopImgShow url={goodsImg || coupon} onClick={goodsImg ? null : () => {}}></PopImgShow>
  );

  return (
    <div className={styles.orderInfo_box}>
      <div className={styles.order_img}>
        {EXPRET_DISTRIBUTION_TYPE[orderType] ? (
          <Badge.Ribbon text={EXPRET_DISTRIBUTION_TYPE[orderType]}>{imgShow}</Badge.Ribbon>
        ) : (
          imgShow
        )}
        <div>{orderSn}</div>
      </div>
      <div className={styles.order_info}>
        <div>
          <Ellipsis length={20} tooltip>
            {goodsName}
          </Ellipsis>
        </div>
        <div style={{ display: 'flex' }}>
          店铺：
          <Ellipsis length={17} tooltip>
            {merchantName}
          </Ellipsis>
        </div>
        <div className={styles.footer}>
          <div>
            <span>结算金额：</span>￥{Number(settlementFee).toFixed(2)}
          </div>
          <div>
            <span>
              {settlementTime}
              {EXPRET_DISTRIBUTION_PAY_STATUS[orderStatus]}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// 买家信息
export const PayerInfo = ({ data }) => {
  const { payer, payerMobile, payFee = 0 } = data;
  return (
    <div className={styles.info_box}>
      <div>{payer}</div>
      <div>{payerMobile}</div>
      <div className={styles.footer}>
        <span>付款金额：</span>￥{Number(payFee).toFixed(2)}
      </div>
    </div>
  );
};

// 订单状态
export const OrderStatusInfo = ({ data }) => {
  const { orderStatus, sumCommission = 0, subCommissionType } = data;
  return (
    <div className={styles.info_box}>
      {EXPRET_DISTRIBUTION_OWN_TYPE[subCommissionType] && (
        <div>
          <Tag color="orange">{EXPRET_DISTRIBUTION_OWN_TYPE[subCommissionType]}订单</Tag>
        </div>
      )}
      <div style={{ color: '#1890ff' }}>{EXPRET_DISTRIBUTION_STATUS[orderStatus]}</div>
      <div className={styles.footer}>
        <span>总佣金：</span>￥{Number(sumCommission).toFixed(2)}
      </div>
    </div>
  );
};

// 豆长 推广者信息
export const PromoterInfo = ({ name, mobile, price = 0 }) => {
  return name ? (
    <div className={styles.info_box}>
      <div>{name}</div>
      <div>{mobile}</div>
      <div className={styles.footer}>
        <span>佣金：</span>￥{Number(price).toFixed(2)}
      </div>
    </div>
  ) : (
    '--'
  );
};
