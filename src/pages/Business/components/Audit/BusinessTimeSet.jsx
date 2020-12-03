import React, { useState, useEffect } from 'react';
import { Form, TimePicker, Switch } from 'antd';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import styles from './style.less';

const BusinessTimeSet = (props) => {
  const { timeObj = '', form, timeKey = 'businessTime' } = props;

  // 时间选择
  const [allTime, setAllTime] = useState(false);
  // 时间选项
  const [timeItem, setTimeItem] = useState(['time1']);
  // 时间选项编号
  const [itemNum, setItemNum] = useState(1);

  useEffect(() => {
    const bTimeArr = timeObj.split(',');
    const disAllTime = timeObj.indexOf('00:00-23:59') > -1 ? true : false;
    form.setFieldsValue({ allTime: disAllTime });
    setAllTime(disAllTime);
    setTimeItem(timeObj ? bTimeArr.map((val, i) => `item5${i + 1}`) : ['time1']);
  }, [timeObj]);

  // 添加时间选择器
  const handleAddTimePicker = () => {
    setTimeItem([...timeItem, [`item${itemNum}`]]);
    setItemNum(itemNum + 1);
  };

  // 删除时间选择器
  const handleRemoveTimePicker = (key) => {
    form.setFieldsValue({ [timeKey]: { [key]: undefined } });
    setTimeItem(timeItem.filter((item) => item != key));
  };

  return (
    <>
      {timeItem.map((item, i) => (
        <div className={styles.audit_picker_item} key={item}>
          <Form.Item
            name={[timeKey, item]}
            noStyle
            rules={[{ required: false, message: '请选择营业时间' }]}
          >
            <TimePicker.RangePicker
              disabled={allTime}
              order={false}
              style={{ width: i > 0 ? '64%' : '65%' }}
              format={'HH:mm'}
            />
          </Form.Item>
          {i != timeItem.length - 1 && (
            <MinusCircleOutlined
              onClick={() => handleRemoveTimePicker(item)}
              style={{ fontSize: 22, margin: '0 10px' }}
            />
          )}
          {i == timeItem.length - 1 && (
            <>
              {i != 0 && (
                <MinusCircleOutlined
                  onClick={() => handleRemoveTimePicker(item)}
                  style={{ fontSize: 22, marginLeft: 10 }}
                />
              )}
              {timeItem.length < 4 && (
                <PlusCircleOutlined
                  onClick={handleAddTimePicker}
                  style={{ fontSize: 22, margin: '0 10px' }}
                />
              )}
            </>
          )}
          {i == 0 && (
            <Form.Item name="allTime" noStyle valuePropName="checked">
              <Switch
                checkedChildren="24小时营业"
                unCheckedChildren="24小时营业"
                onChange={() => {
                  setAllTime(!allTime);
                }}
              />
            </Form.Item>
          )}
        </div>
      ))}
    </>
  );
};

export default BusinessTimeSet;
