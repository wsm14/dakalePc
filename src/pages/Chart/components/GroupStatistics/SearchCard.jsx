import React from 'react';
import moment from 'moment';
import {DatePicker, Space, Button, Select } from 'antd';
const { Option } = Select;
const disTime = moment('2020-03-01');

// 数据概况 + 视频看板 公用
const SearchCard = ({ timeData, setTimeData, handleSearch }) => {
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
    {
      name: '自定义',
      value: '0',
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
        setTimeData([moment().subtract(1, 'day'), moment().subtract(1, 'day')]);
        break;
      case '7':
        setTimeData(returnDay(6, 'day'));
        break;
      case '30':
        setTimeData(returnDay(30, 'day'));
        break;
      case '0':
        setTimeData([]);
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
        value={timeData}
        onChange={(val) => handleSearchData(val)}
        disabledDate={disabledDate}
        style={{ width: 256 }}
      />
      <Button type="primary" onClick={() => handleSearch(timeData)}>
        搜索
      </Button>
    </Space>
  );
};

export default SearchCard;
