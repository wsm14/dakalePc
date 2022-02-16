import React from 'react';
import { DatePicker } from 'antd';
import { delectProps } from '../utils';

const { RangePicker } = DatePicker;

const DatePickerBlock = (props) => {
  const { type = 'rangePicker' } = props;

  const pockerDefault = delectProps({ width: '100%', ...props });
  delete pockerDefault.placeholder;

  return {
    dataPicker: <DatePicker {...pockerDefault} />,
    rangePicker: <RangePicker {...pockerDefault} />,
  }[type];
};

export default DatePickerBlock;
