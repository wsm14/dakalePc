import cascader from './Cascader';
import datePicker from './DatePicker';
import input from './Input';
import number from './NumberInput';
import numberGroup from './NumberGroup';
import select from './Select';

const Searchor = {
  cascader,
  datePicker,
  rangePicker: datePicker,
  input,
  number,
  numberGroup,
  select,
  multiple: select,
};

export { Searchor };
