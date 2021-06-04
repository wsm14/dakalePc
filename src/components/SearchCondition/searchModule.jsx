import cascader from './Cascader';
import datePicker from './DatePicker';
import input from './Input';
import number from './NumberInput';
import numberGroup from './NumberGroup';
import select from './Select';
import merchant from './Merchant';
import user from './User';

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
};

export { Searchor };
