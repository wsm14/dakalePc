import React from 'react';
import moment from 'moment';
import { connect } from 'umi';
import { DatePicker } from 'antd';
import { DownOutlined } from '@ant-design/icons';

const disTime = moment('2020-03-01');

const SearchCard = ({ timeData, api, loading, setTimeData }) => {
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
        disabled={loading.effects[api]}
        bordered={false}
        suffixIcon={<DownOutlined></DownOutlined>}
        allowClear={false}
        value={timeData}
        onChange={(val) => handleSearchData(val)}
        disabledDate={disabledDate}
        ranges={timeObj}
        style={{
          width: 250,
        }}
      />
    </div>
  );
};

export default connect(({ loading }) => ({ loading }))(SearchCard);
