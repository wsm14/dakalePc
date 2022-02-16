import React from 'react';
import { TimePicker } from 'antd';
import { delectProps } from '../utils';

const TimeRangePickerBlock = (props) => {
  const { format } = props;
  
  const divProps = delectProps(props);
  delete divProps.placeholder;

  return (
    <TimePicker.RangePicker
      allowClear={false}
      style={{ width: '100%' }}
      {...divProps}
      format={format || 'HH:mm'}
    />
  );
};

export default TimeRangePickerBlock;
