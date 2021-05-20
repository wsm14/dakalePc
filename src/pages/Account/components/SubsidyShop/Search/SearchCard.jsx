import React from 'react';
import moment from 'moment';
import { Tag, DatePicker, Space, Checkbox } from 'antd';
import styles from './style.less';

const disTime = moment('2020-03-01');

const SearchCard = ({ tabkey, searchData, setSearchData }) => {
  const { time, type } = searchData;

  // 选择时间
  const handleSearchData = (value) => {
    setSearchData({ ...searchData, ...value, page: 1, limit: 10 });
  };

  // 激活tag
  const isActive = (tag) => {
    const value = timeTagSelect[tag];
    if (!time[0] || !time[1]) {
      return false;
    }
    if (time[0].isSame(value[0], 'day') && time[1].isSame(value[1], 'day')) {
      return true;
    }
    return false;
  };

  // 禁止选择时间
  const disabledDate = (current) =>
    (current && current > moment().endOf('day')) || current < disTime;

  // 起始时间计算
  const setStartEndTime = (type) => [
    moment().subtract(1, type).startOf(type),
    moment().subtract(1, type).endOf(type),
  ];

  // 时间选择项目
  const timeTagSelect = {
    order: {
      今日: [moment(), moment()],
      昨日: [moment().subtract(1, 'day'), moment().subtract(1, 'day')],
      前日: [moment().subtract(2, 'day'), moment().subtract(2, 'day')],
      本周: [moment().startOf('week'), moment()],
      本月: [moment().startOf('month'), moment()],
    },
    day: {
      本月: [moment().startOf('month'), moment()],
      上月: setStartEndTime('month'),
    },
    month: {
      今年: [moment().startOf('year'), moment()],
      去年: setStartEndTime('year'),
    },
  }[tabkey];

  // 类型选择项目
  const options = [
    { label: '营销卡豆充值', value: 'platform' },
    { label: '平台直充', value: 'directCharge' },
    { label: '平台直充回收', value: 'recycleDirectCharge' },
    { label: '营销卡豆回收', value: 'recyclePlatform' },
    { label: '新手任务补贴', value: 'platformSubsidy' },
  ];

  return (
    <>
      <Space style={{ marginBottom: 20 }}>
        时间：
        <DatePicker.RangePicker
          allowClear={false}
          value={time}
          disabledDate={disabledDate}
          picker={tabkey}
          style={{ width: 256 }}
          onChange={(val) => handleSearchData({ time: val })}
        />
        <div className={styles.salesExtra}>
          {Object.keys(timeTagSelect).map((tag) => (
            <Tag.CheckableTag
              key={tag}
              checked={isActive(tag)}
              onChange={() => handleSearchData({ time: timeTagSelect[tag] })}
            >
              {tag}
            </Tag.CheckableTag>
          ))}
        </div>
      </Space>
      <div style={{ marginBottom: 20 }}>
        <Space>
          类型：
          <Checkbox.Group
            options={options}
            value={type}
            onChange={(val) => handleSearchData({ type: val })}
          />
        </Space>
      </div>
    </>
  );
};

export default SearchCard;
