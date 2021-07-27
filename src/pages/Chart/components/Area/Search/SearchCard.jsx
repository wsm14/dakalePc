import React, { useState } from 'react';
import moment from 'moment';
import { Tag, DatePicker, Select, Space } from 'antd';
import CITYJSON from '@/common/city';
import styles from './style.less';

const disTime = moment('2020-03-01');

const SearchCard = ({
  setSearchData,
  searchData,
  cityShow,
}) => {
  const [selectedTime, setSelectedTime] = useState([moment(), moment()]);

  // 时间计算
  const returnDay = (day, type) => [moment().subtract(day, type), moment()];

  // 禁止选择时间
  const disabledDate = (current) =>
    (current && current > moment().endOf('day')) || current < disTime;

  const timeObj = {
    昨日: [moment().subtract(1, 'day'), moment().subtract(1, 'day')],
    近7日: returnDay(6, 'day'),
    近1月: returnDay(1, 'month'),
  };

  // 选择时间
  const handleSearchData = (time, areaCode) => {
    setSearchData(time, areaCode);
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
      {cityShow && (
        <Select
          defaultValue={searchData.areaCode}
          showSearch
          optionFilterProp="label"
          style={{ width: 150 }}
          options={CITYJSON}
          placeholder={`请选择省份`}
          onChange={(val) => handleSearchData(selectedTime, val)}
        ></Select>
      )}
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
