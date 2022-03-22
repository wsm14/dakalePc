import React, { useState, useEffect } from 'react';
import { Space, Select, DatePicker } from 'antd';
import moment from 'moment';

const { Option } = Select;

const TimeSearch = (props) => {
  const { data, setData } = props;
  const [selectedTime, setSelectedTime] = useState(moment().subtract(1, 'day')); // 暂存时间
  const [selectedTimeType, setSelectedTimeType] = useState(0); // 暂存时间范围

  useEffect(() => {
    setData((old) => ({
      ...old,
      startStatisticDay: moment(selectedTime)
        .subtract(selectedTimeType, 'day')
        .format('YYYY-MM-DD'),
      endStatisticDay: moment(selectedTime).format('YYYY-MM-DD'),
    }));
  }, [selectedTime, selectedTimeType]);

  const onChangeTime = (date, dateString) => {
    setSelectedTime(date);
  };

  //   选择时间范围
  const handleChangeDay = (val) => {
    setSelectedTimeType(val);
  };

  return (
    <Space style={{ width: '100%' }}>
      {/* 选择用户类型，目前只有新增用户数 */}
      <Select defaultValue="userPortrait" style={{ width: 120 }}>
        <Option value="userPortrait">新增用户数</Option>
      </Select>
      {/* 选择时间 */}
      <DatePicker value={selectedTime} allowClear={false} onChange={onChangeTime} />
      {/* 选择时间范围 */}
      <Select value={selectedTimeType} style={{ width: 120 }} onChange={handleChangeDay}>
        <Option value={0}>近1天</Option>
        <Option value={6}>近7天</Option>
        <Option value={29}>近30天</Option>
      </Select>
      <div>{`${moment(selectedTime)
        .subtract(selectedTimeType, 'day')
        .format('YYYY-MM-DD')}至${moment(selectedTime).format('YYYY-MM-DD')}`}</div>
    </Space>
  );
};

export default TimeSearch;
