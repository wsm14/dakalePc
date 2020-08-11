import React, { useState, useEffect } from 'react';
import { Form, Space, Row, Col, Input, Button, Select, DatePicker, InputNumber } from 'antd';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import { TIME_UNIX_E, TIME_UNIX_S } from '@/common/constant';
import moment from 'moment';
import styles from './index.less';

const disTime = moment('2020-03-01');
// 限制选择时间
const disabledDate = (current) => (current && current > moment().endOf('day')) || current < disTime;

const returnDay = (day, type) => [moment().subtract(day, type), moment()];

const ranges = {
  当天: [moment(), moment()],
  当月: [moment().startOf('month'), moment().endOf('day')],
  最近7日: returnDay(6, 'day'),
  最近15日: returnDay(14, 'day'),
  最近一月: returnDay(1, 'month'),
  上一个月: [
    moment(moment().startOf('month')).subtract(1, 'month'),
    moment(moment().startOf('month')).subtract(1, 'day'),
  ],
};

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

const SearchCondition = (props) => {
  const { formItems, handleSearch, resetValue, btnExtra = '', componentSize = 'default' } = props;

  const [form] = Form.useForm();

  const [expand, setExpand] = useState(false);
  const [formValue] = useState({});

  const getFields = () => {
    const len = formItems.length;
    const count = expand ? len : componentSize !== 'default' ? 6 : 4;
    const children = [];
    formItems.forEach((item, i) => {
      let initialValue = '';
      const placeholder = item.placeholder || '';
      let component = (
        <Input placeholder={placeholder || `请输入${item.label}`} style={{ width: '100%' }} />
      );
      // 判断类型
      if (item.type === 'select' && item.select) {
        const { select } = item;
        initialValue = select.defaultValue || '';
        component = (
          <Select style={{ width: '100%' }} placeholder={item.placeholder || `请选择`}>
            <Option value={initialValue}>全部</Option>
            {select.list.map((data, j) => {
              if (data) {
                // 兼容数组
                const value = !data.value ? `${j}` : data.value;
                const name = data.value ? data.name : data;
                return (
                  <Option key={j} value={value}>
                    {name}
                  </Option>
                );
              }
            })}
          </Select>
        );
      }
      if (item.type === 'number') {
        initialValue = item.initialValue ? `${item.initialValue}` : '';
        component = <InputNumber placeholder={placeholder} style={{ width: '100%' }} />;
      }
      if (item.type === 'rangePicker') {
        initialValue = item.defaultValue || [];
        component = (
          <RangePicker
            style={{ width: '100%' }}
            allowClear={false}
            defaultPickerValue={[
              moment(moment().startOf('month')).subtract(1, 'month'),
              moment(moment().startOf('month')).subtract(1, 'day'),
            ]}
            disabledDate={disabledDate}
            ranges={item.ranges || ranges}
            renderExtraFooter={() => (
              <div className={styles.shop_dateInfo}>
                开始时间：选择日期的 00：00：00，结束时间：选择日期的 23：59：59
              </div>
            )}
          />
        );
      }
      if (item.type === 'datePicker') {
        component = <DatePicker style={{ width: '100%' }} allowClear={false} />;
      }
      formValue[item.name] = initialValue;
      children.push(
        <Col
          span={componentSize !== 'default' ? (item.type === 'rangePicker' ? 9 : 6) : 6}
          key={i}
          style={{ display: i < count ? 'inline' : 'none' }}
        >
          <FormItem label={item.label} style={{ paddingBottom: 8 }} name={item.name}>
            {component}
          </FormItem>
        </Col>,
      );
    });
    return children;
  };

  const handleSearchsOver = (values) => {
    const formObj = {};
    formItems.forEach((item) => {
      if (values[item.name]) {
        if (item.type === 'datePicker') formObj[item.name] = values[item.name].format('YYYY-MM-DD');
        if (item.type === 'rangePicker')
          formObj[item.name] = [
            Number(TIME_UNIX_S(values.times[0])),
            Number(TIME_UNIX_E(values.times[1])),
          ];
      }
    });
    handleSearch({ ...values, ...formObj });
  };

  const handleReset = () => {
    form.resetFields();
  };

  const toggle = () => setExpand(!expand);

  useEffect(() => {
    handleReset();
  }, [resetValue]);

  const len = formItems.length;
  const search = (span) => (
    <div style={{ textAlign: 'right' }}>
      <Space>
        <Button type="primary" htmlType="submit">
          查询
        </Button>
        <Button onClick={handleReset}>重置</Button>
        {btnExtra}
      </Space>
      {len > (componentSize !== 'default' ? 6 : 4) ? (
        <a style={{ marginLeft: 8, fontSize: 12 }} onClick={toggle}>
          {expand ? '收起' : '展开'}
          {expand ? <UpOutlined /> : <DownOutlined />}
        </a>
      ) : null}
    </div>
  );

  return (
    <Form
      form={form}
      size={componentSize}
      initialValues={formValue}
      layout="horizontal"
      className={styles.form}
      onFinish={handleSearchsOver}
    >
      <div style={{ display: 'flex' }}>
        <Row gutter={24} style={{ flex: 1, padding: '0 10px' }}>
          {getFields()}
        </Row>
        {search(24 - len * 6 - 1)}
      </div>
    </Form>
  );
};

export default SearchCondition;
