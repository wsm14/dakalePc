import React, { useEffect, useState } from 'react';
import { Radio, Space, Select, DatePicker, Checkbox } from 'antd';
import { connect } from 'umi';
import moment from 'moment';
import styles from './style.less';

const { Option } = Select;

const disTime = moment('2020-03-01');

/**
 *
 * @param {*} data 初始入参数据
 * @param {*} setData 操作初始入参数据
 * @param {*} btnObjKeyName 用户类型入参字段，键值
 * @param {*} groupTypeName 日月粒度入参字段，键值
 * @param {*} appTypeName 端口类型入参字段，键值
 * @param {*} btnObj 用户类型
 * @param {*} portTypeList 端口类型
 * @param {*} defaultPortType 默认端口类型
 * @param {*} allText 总计均值文本
 * @param {*} dispatchType 请求路径
 * @param {*} beginDateKey 开始时间搜索键值
 * @param {*} endDateKey 结束时间搜索键值
 * @returns
 */

const SearchBlock = ({
  setData,
  btnObjKeyName = 'reportType',
  groupTypeName = 'groupType',
  appTypeName = 'appType',
  beginDateKey = 'startStatisticDay',
  endDateKey = 'endStatisticDay',
  timeOk = true,
  timeDayMonthOk = true,
  btnObj = {},
  portTypeList = [],
  defaultPortType,
  allText = '',
}) => {
  const [selectedTime, setSelectedTime] = useState([
    moment().subtract(7, 'day'),
    moment().subtract(1, 'day'),
  ]); // 暂存时间
  const [selectedTimeType, setSelectedTimeType] = useState('最近7日'); // 暂存时间类型

  // 数据储存
  const saveData = (val) => {
    setData((old) => ({ ...old, ...val }));
  };

  // 禁止选择时间
  const disabledDate = (current) =>
    (current && current > moment().endOf('day').subtract(1, 'day')) || current < disTime;

  // 时间计算
  const returnDay = (day, type) => [moment().subtract(day, type), moment().subtract(1, 'day')];

  const timeObj = {
    最近7日: returnDay(7, 'day'),
    最近30天: returnDay(30, 'day'),
    自定义: '',
  };

  // 选择时间范围类型 近几天或自定义
  const handleChangeDay = (val) => {
    setSelectedTimeType(val);
    if (val === '自定义') return;
    setSelectedTime(timeObj[val]);
    saveData({
      [beginDateKey]: timeObj[val][0].format('YYYY-MM-DD'),
      [endDateKey]: timeObj[val][1].format('YYYY-MM-DD'),
    });
  };
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      {Object.keys(btnObj).length !== 0 && (
        <div>
          <Radio.Group
            defaultValue={Object.keys(btnObj)[0]}
            onChange={(e) => saveData({ [btnObjKeyName]: e.target.value })}
            style={{ marginTop: 16 }}
          >
            {Object.keys(btnObj).map((item) => {
              return (
                <Radio.Button key={item} value={item}>
                  {btnObj[item]}
                </Radio.Button>
              );
            })}
          </Radio.Group>
        </div>
      )}
      {timeOk && (
        <div>
          <Select value={selectedTimeType} style={{ width: 120 }} onChange={handleChangeDay}>
            {Object.keys(timeObj).map((item) => {
              return (
                <Option key={item} value={item}>
                  {item}
                </Option>
              );
            })}
          </Select>
          <DatePicker.RangePicker
            allowClear={false}
            value={selectedTime}
            onChange={(val) => {
              setSelectedTime(val);
              saveData({
                [beginDateKey]: val[0].format('YYYY-MM-DD'),
                [endDateKey]: val[1].format('YYYY-MM-DD'),
              });
            }}
            disabled={selectedTimeType !== '自定义'}
            disabledDate={disabledDate}
            style={{ width: 256 }}
          />
          <div className={styles.salesExtra} style={{ marginLeft: 30 }}>
            {allText}
          </div>
          {timeDayMonthOk && (
            <div className={styles.salesExtra} style={{ float: 'right' }}>
              <Select
                defaultValue="day"
                style={{ width: 120 }}
                onChange={(val) => saveData({ [groupTypeName]: val })}
              >
                <Option value="day">日粒度</Option>
                <Option value="month">月粒度</Option>
              </Select>
            </div>
          )}
        </div>
      )}
      {portTypeList.length !== 0 && (
        <div>
          <Checkbox.Group
            options={portTypeList}
            defaultValue={defaultPortType}
            onChange={(val) => saveData({ [appTypeName]: val.toString() })}
          />
        </div>
      )}
    </Space>
  );
};

export default connect(({}) => ({}))(SearchBlock);
