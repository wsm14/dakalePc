import activity from './Activity';
import vaneWind from './VaneWind';
import merchant from './Merchant';
import specialGoods from './SpecialGoods';
import coupon from './Coupon';

const showBlock = ['vaneWind', 'activity', 'merchant', 'specialGoods', 'coupon'];

export default (props) => {
  const { showApi } = props;
  if (!showBlock.includes(showApi)) return null;
  const ShowDom = { activity, vaneWind, merchant, specialGoods, coupon }[showApi];
  return <ShowDom {...props}></ShowDom>;
};
