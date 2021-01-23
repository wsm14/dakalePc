import React, { useState } from 'react';
import moment from 'moment';
import { Tag, DatePicker, Space } from 'antd';
import styles from './style.less';

const disTime = moment('2020-03-01');

const SearchCard = ({ setSearchData, bucket }) => {
  const [selectedTime, setSelectedTime] = useState([moment(), moment()]);

  // 禁止选择时间
  const disabledDate = (current) =>
    (current && current > moment().endOf('day')) || current < disTime;

  const timeObj = {
    今日: [moment(), moment()],
    昨日: [moment().subtract(1, 'day'), moment().subtract(1, 'day')],
    前日: [moment().subtract(2, 'day'), moment().subtract(2, 'day')],
    本周: [moment().startOf('week'), moment()],
    本月: [moment().startOf('month'), moment().subtract(2, 'day')],
  };

  // 选择时间
  const handleSearchData = (time) => {
    console.log(time);
    // setSearchData(time);
    setSelectedTime(time);
  };

  // 激活tag
  const isActive = (tag) => {
    const value = timeObj[tag];
    if (!selectedTime[0] || !selectedTime[1]) {
      return false;
    }
    if (selectedTime[0].isSame(value[0], 'day') && selectedTime[1].isSame(value[1], 'day')) {
      return true;
    }
    return false;
  };

  return (
    <Space style={{ marginBottom: 20 }}>
      <DatePicker.RangePicker
        allowClear={false}
        value={selectedTime}
        onChange={(val) => handleSearchData(val)}
        disabledDate={disabledDate}
        picker="mondath"
        style={{
          width: 256,
        }}
      />
      <div className={styles.salesExtra}>
        {Object.keys(timeObj).map((tag) => (
          <Tag.CheckableTag
            key={tag}
            checked={isActive(tag)}
            onChange={() => handleSearchData(timeObj[tag])}
          >
            {tag}
          </Tag.CheckableTag>
        ))}
      </div>
    </Space>
  );
};

export default SearchCard;
