import cascader from './Cascader';
import datePicker from './DatePicker';
import input from './Input';
import number from './NumberInput';
import numberGroup from './NumberGroup';
import select from './Select';
import merchant from './Merchant';
import user from './User';
import coupon from './Coupon'; // 优惠券搜索
import good from './Good'; //商品搜索

const Searchor = {
  cascader,
  datePicker,
  rangePicker: datePicker,
  input,
  number,
  numberGroup,
  select,
  multiple: select,
  merchant,
  user,
  coupon,
  good
};

export { Searchor };
