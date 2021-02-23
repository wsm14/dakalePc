import cascader from './Cascader';
import datePicker from './DatePicker';
import input from './Input';
import number from './NumberInput';
import select from './Select';

const Searchor = {
  cascader,
  datePicker,
  rangePicker: datePicker,
  input,
  number,
  select,
  multiple: select,
};

export { Searchor };
