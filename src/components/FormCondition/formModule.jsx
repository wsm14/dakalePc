import cascader from './Cascader';
import checkbox from './Checkbox';
import dataPicker from './DatePicker';
import rangePicker from './DatePicker';
import input from './Input';
import number from './InputNumber';
import radio from './Radio';
import select from './Select';
import switchBlock from './Switch';
import textArea from './TextArea';
import timePicker from './TimePicker';
import upload from './Upload/Img';
import videoUpload from './Upload/Video';
import otherUpload from './Upload/Other';

const IFormModule = {
  input,
  number,
  textArea,
  checkbox,
  cascader,
  timePicker,
  dataPicker,
  rangePicker,
  radio,
  select,
  upload,
  videoUpload,
  otherUpload,
  tags: select,
  switch: switchBlock,
};

export { IFormModule };
