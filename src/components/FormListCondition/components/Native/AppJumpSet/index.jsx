import activity from './Activity';
import vaneWind from './VaneWind';

const showBlock = ['vaneWind', 'activity'];

export default (props) => {
  const { showApi } = props;
  if (!showBlock.includes(showApi)) return null;
  const ShowDom = { activity, vaneWind }[showApi];
  return <ShowDom {...props}></ShowDom>;
};
