import React from 'react';
import moment from 'moment';
import { DatePicker } from 'antd';

const disTime = moment('2020-03-01');

const SearchCard = ({ timeData, setTimeData }) => {
  // 时间计算
  const returnDay = (day, type) => [moment().subtract(day, type), moment()];

  // 禁止选择时间
  const disabledDate = (current) =>
    (current && current > moment().endOf('day')) || current < disTime;

  const timeObj = {
    今日: [moment(), moment()],
    昨日: [moment().subtract(1, 'day'), moment().subtract(1, 'day')],
    近7日: returnDay(6, 'day'),
    近1月: returnDay(1, 'month'),
  };

  // 选择时间
  const handleSearchData = (time) => setTimeData(time);

  return (
    <div style={{ marginLeft: -12 }}>
      <DatePicker.RangePicker
        bordered={false}
        suffixIcon={null}
        allowClear={false}
        value={timeData}
        onChange={(val) => handleSearchData(val)}
        disabledDate={disabledDate}
        ranges={timeObj}
        style={{
          width: 200,
        }}
      />
    </div>
  );
};

export default SearchCard;
