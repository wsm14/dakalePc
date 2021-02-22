import React from 'react';
import moment from 'moment';
import { DatePicker } from 'antd';

/**
 * 时间选择控件
 */

// 起始时间限制
const { RangePicker } = DatePicker;

const disTime = moment('2020-03-01');

// 限制选择时间
const disabledDate = (current) => (current && current > moment().endOf('day')) || current < disTime;

// 时间计算
const returnDay = (day, type) => [moment().subtract(day, type), moment()];

// 时间选择器底部快捷选择
const ranges = {
  当天: [moment(), moment()],
  当月: [moment().startOf('month'), moment().endOf('day')],
  最近7日: returnDay(6, 'day'),
  最近15日: returnDay(14, 'day'),
  最近一月: returnDay(1, 'month'),
  上一个月: [
    moment(moment().startOf('month')).subtract(1, 'month'),
    moment(moment().startOf('month')).subtract(1, 'day'),
  ],
};

const DatePickerBlock = (props) => {
  const { type, picker, ranges: pRanges, disabledDate: pDisabledDate } = props;

  // 时间选择器默认配置
  const pockerDefault = { width: '100%', allowClear: true };

  // 返回结果
  return {
    // 单时间选择器
    datePicker: <DatePicker {...pockerDefault} picker={picker || 'date'} {...props} />,
    // 日期区间选择器
    rangePicker: (
      <RangePicker
        {...pockerDefault}
        defaultPickerValue={[
          moment(moment().startOf('month')).subtract(1, 'month'),
          moment(moment().startOf('month')).subtract(1, 'day'),
        ]}
        disabledDate={pDisabledDate || disabledDate}
        ranges={pRanges || pDisabledDate ? '' : ranges}
        {...props}
      />
    ),
  }[type];
};

export default DatePickerBlock;
