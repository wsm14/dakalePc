import input from './Input';
import vaneWind from './VaneWind';
import merchant from './Merchant';
import specialGoods from './SpecialGoods';
import coupon from './Coupon';
import phoneBill from './PhoneBill'; // 话费
import memberRecharge from './MemberRecharge'; // 会员充值
import defaultData from './DefaultData'; // 固定写死携带默认值

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
    beanSelection: defaultData,
    telephoneFeeDeductionCouponPackage: defaultData,
    platformGeneralCouponPackage: defaultData,
    commerceGoodsPackage: defaultData,
    phoneBill, // 话费
    memberRecharge, // 会员充值
    newToday: defaultData,
  }[showApi];
  if (!ShowDom) return null;

  let otherProps = {};
  // 选择店铺/集团时
  if (showApi === 'merchant' || showApi === 'merchantGroup') {
    otherProps = { owType: { merchant: 'merchant', merchantGroup: 'group' }[showApi] };
  }

  return <ShowDom {...props} {...otherProps}></ShowDom>;
};
