import React, { useState } from 'react';
import moment from 'moment';
import { Tag, DatePicker, Space } from 'antd';
import styles from './style.less';

const disTime = moment().subtract(1, 'day');

const SearchCard = ({ setSearchData }) => {
  const [selectedTime, setSelectedTime] = useState([moment(), moment()]);

  // 时间计算
  const returnDay = (day, type) => [moment().subtract(day, type), disTime];

  // 禁止选择时间
  const disabledDate = (current) => current && current > moment().subtract(1, 'day').endOf('day');

  const timeObj = {
    今日: [moment(), moment()],
    昨日: [moment().subtract(1, 'day'), moment().subtract(1, 'day')],
    近7日: returnDay(7, 'day'),
    近1月: returnDay(1, 'month'),
  };

  // 选择时间
  const handleSearchData = (time) => {
    setSearchData(time);
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
    <Space>
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
      <DatePicker.RangePicker
        allowClear={false}
        value={selectedTime}
        onChange={(val) => handleSearchData(val)}
        disabledDate={disabledDate}
        style={{
          width: 256,
        }}
      />
    </Space>
  );
};

export default SearchCard;
