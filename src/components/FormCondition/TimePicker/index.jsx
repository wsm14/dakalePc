import React from 'react';
import { TimePicker } from 'antd';

const TimeRangePickerBlock = (props) => {
  const { format } = props;
  return (
    <TimePicker.RangePicker
      allowClear={false}
      style={{ width: '100%' }}
      format={format || 'HH:mm'}
      {...props}
    />
  );
};

export default TimeRangePickerBlock;
