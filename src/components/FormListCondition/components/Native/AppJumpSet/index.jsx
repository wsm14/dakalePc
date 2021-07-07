import activity from './Activity';
import vaneWind from './VaneWind';
import merchant from './Merchant';
import specialGoods from './SpecialGoods';

const showBlock = ['vaneWind', 'activity', 'merchant', 'specialGoods'];

export default (props) => {
  const { showApi } = props;
  if (!showBlock.includes(showApi)) return null;
  const ShowDom = { activity, vaneWind, merchant, specialGoods }[showApi];
  return <ShowDom {...props}></ShowDom>;
};
