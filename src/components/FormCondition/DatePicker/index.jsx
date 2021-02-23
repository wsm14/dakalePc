import React from 'react';
import { DatePicker } from 'antd';

const { RangePicker } = DatePicker;

const DatePickerBlock = (props) => {
  const { type = 'rangePicker' } = props;

  const pockerDefault = { width: '100%', ...props };

  return {
    dataPicker: <DatePicker {...pockerDefault} />,
    rangePicker: <RangePicker {...pockerDefault} />,
  }[type];
};

export default DatePickerBlock;
