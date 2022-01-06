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
    specialGoods,
    coupon,
    beanSelection,
    telephoneFeeDeductionCouponPackage: giftType,
    platformGeneralCouponPackage: giftType,
    commerceGoodsPackage: giftType,
  }[showApi];
  if (!ShowDom) return null;
  return <ShowDom {...props}></ShowDom>;
};
