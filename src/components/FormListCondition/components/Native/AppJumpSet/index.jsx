import input from './Input';
import vaneWind from './VaneWind';
import merchant from './Merchant';
import specialGoods from './SpecialGoods';
import coupon from './Coupon';
import selection from './Selection';
import giftType from './GiftType'; // 固定写死携带默认值，选择类型时赋值

export default (props) => {
  const { showApi } = props;
  const ShowDom = {
    activity: input,
    shareActive: input,
    vaneWind,
    merchant,
    merchantGroup: merchant,
    specialGoods,
    coupon,
    beanSelection: giftType,
    telephoneFeeDeductionCouponPackage: giftType,
    platformGeneralCouponPackage: giftType,
    commerceGoodsPackage: giftType,
    phoneBill: selection, // 话费
    memberRecharge: selection, // 会员充值
  }[showApi];
  if (!ShowDom) return null;

  let otherProps = {};
  // 选择店铺/集团时
  if (showApi === 'merchant' || showApi === 'merchantGroup') {
    otherProps = { owType: { merchant: 'merchant', merchantGroup: 'group' }[showApi] };
  }

  return <ShowDom {...props} {...otherProps}></ShowDom>;
};
