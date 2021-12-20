import React, { useState, useEffect } from 'react';
import { useLocation } from 'umi';
import moment from 'moment';
import { Tag, DatePicker, Cascader, Space } from 'antd';
import CITYJSON from '@/common/city';
import styles from './style.less';

const disTime = moment('2020-03-01');

const SearchCard = ({ setSearchData, timeData, cityData, bucket }) => {
  const [selectedTime, setSelectedTime] = useState([
    moment().subtract(1, 'day'),
    moment().subtract(1, 'day'),
  ]);

  const params = useLocation();

  useEffect(() => {
    const { beginDate, endDate } = params.query;
    if (beginDate) {
      setSelectedTime([moment(beginDate), moment(endDate)]);
    }
  }, []);

  // 时间计算
  const returnDay = (day, type) => [moment().subtract(day, type), moment()];

  // 禁止选择时间
  const disabledDate = (current) =>
    (current && current > moment().endOf('day').subtract(1, 'day')) || current < disTime;

  const timeObj = {
    昨日: [moment().subtract(1, 'day'), moment().subtract(1, 'day')],
    近7日: returnDay(6, 'day'),
    近1月: returnDay(1, 'month'),
  };

  const cityObj = {
    杭州: ['33', '3301'],
    湘西: ['43', '4331'],
  };

  // 选择时间
  const handleSearchData = (time, areaCode) => {
    console.log(time, areaCode);
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
            onChange={() => handleSearchData(timeObj[tag], Object.values(cityData))}
          >
            {tag}
          </Tag.CheckableTag>
        ))}
      </div>
      <DatePicker.RangePicker
        allowClear={false}
        value={selectedTime}
        onChange={(val) => handleSearchData(val, Object.values(cityData))}
        disabledDate={disabledDate}
        style={{ width: 256 }}
      />
      <div className={styles.salesExtra}>
        {Object.keys(cityObj).map((tag) => (
          <Tag.CheckableTag
            key={tag}
            // checked={isActive(tag)}
            // onChange={() => handleSearchData(timeObj[tag], Object.values(cityData))}
          >
            {tag}
          </Tag.CheckableTag>
        ))}
      </div>
      <Cascader
        defaultValue={bucket ? [bucket] : []}
        changeOnSelect
        expandTrigger="hover"
        options={CITYJSON}
        style={{
          width: 256,
        }}
        placeholder={`请选择省市区`}
        showSearch={{
          filter: (inputValue, path) => {
            return path.some((option) => option.label.indexOf(inputValue) > -1);
          },
        }}
        onChange={(val) => handleSearchData(selectedTime, val)}
      ></Cascader>
    </Space>
  );
};

export default SearchCard;
