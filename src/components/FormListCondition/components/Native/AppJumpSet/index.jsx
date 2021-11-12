import input from './Input';
import vaneWind from './VaneWind';
import merchant from './Merchant';
import specialGoods from './SpecialGoods';
import coupon from './Coupon';

export default (props) => {
  const { showApi } = props;
  const ShowDom = { activity: input, shareActive: input, vaneWind, merchant, specialGoods, coupon }[
    showApi
  ];
  if (!ShowDom) return null;
  return <ShowDom {...props}></ShowDom>;
};
