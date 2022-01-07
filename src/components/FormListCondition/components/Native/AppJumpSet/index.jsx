import input from './Input';
import vaneWind from './VaneWind';
import merchant from './Merchant';
import specialGoods from './SpecialGoods';
import coupon from './Coupon';
import beanSelection from './BeanSelection';
import giftType from './GiftType';

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
  }[showApi];
  if (!ShowDom) return null;

  let otherProps = {};
  // 选择店铺/集团时
  if (showApi === 'merchant' || showApi === 'merchantGroup') {
    otherProps = { owType: { merchant: 'merchant', merchantGroup: 'group' }[showApi] };
  }

  return <ShowDom {...props} {...otherProps}></ShowDom>;
};
