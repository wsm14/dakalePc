import React, { useState, useEffect } from 'react';
import { useLocation } from 'umi';
import moment from 'moment';
import { Tag, DatePicker, Space, Button, Select } from 'antd';
import styles from './style.less';
const { Option } = Select;
const disTime = moment('2020-03-01');

// 数据概况 + 视频看板 公用
const SearchCard = ({ setSearchData }) => {
  const [selectedTime, setSelectedTime] = useState([
    moment().subtract(1, 'day'),
    moment().subtract(1, 'day'),
  ]); // 暂存时间

  // 时间计算
  const returnDay = (day, type) => [moment().subtract(day, type), moment()];

  // 禁止选择时间
  const disabledDate = (current) =>
    (current && current > moment().endOf('day').subtract(1, 'day')) || current < disTime;
    
  const timeSelect = [
    {
      name: '昨日',
      value: '1',
    },
    {
      name: '最近7天',
      value: '7',
    },
    {
      name: '最近30天',
      value: '30',
    },
  ];

  // const timeObj = {
  //   昨日: [moment().subtract(1, 'day'), moment().subtract(1, 'day')],
  //   最近7天: returnDay(6, 'day'),
  //   最近30天: returnDay(30, 'day'),
  // };

  // 选择时间
  const handleSearchData = (time) => {};
  const handleChange = (val) => {
    switch (val) {
      case '1':
        setSelectedTime([moment().subtract(1, 'day'), moment().subtract(1, 'day')]);
        break;
      case '7':
        setSelectedTime(returnDay(6, 'day'));
        break;
      case '30':
        setSelectedTime(returnDay(30, 'day'));
        break;
    }
  };

  return (
    <Space style={{ marginBottom: 30 }}>
      <Select style={{ width: 200 }} onChange={handleChange}>
        {timeSelect.map((item) => (
          <Option value={item.value} key={item.name}>
            {item.name}
          </Option>
        ))}
      </Select>
      <DatePicker.RangePicker
        allowClear={false}
        value={selectedTime}
        onChange={(val) => handleSearchData(val)}
        disabledDate={disabledDate}
        style={{ width: 256 }}
      />
    </Space>
  );
};

export default SearchCard;
