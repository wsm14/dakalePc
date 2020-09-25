import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {
  Form,
  Space,
  Row,
  Col,
  Input,
  Button,
  Select,
  DatePicker,
  InputNumber,
  Cascader,
  Grid,
} from 'antd';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import CITYJSON from '@/common/city';
import styles from './index.less';

// 城市搜索筛选
const filter = (inputValue, path) => {
  return path.some((option) => option.label.indexOf(inputValue) > -1);
};

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
const { useBreakpoint } = Grid;

const SearchCondition = (props) => {
  const {
    searchItems: formItems,
    handleSearch,
    btnExtra = '',
    componentSize = 'default',
    initialValues = {},
    NoSearch = false,
  } = props;

  const [form] = Form.useForm();
  const screens = useBreakpoint();

  const [expand, setExpand] = useState(false);

  const len = formItems.length;
  // 不同屏幕大小显示个数
  let count = 2;
  if (screens.xxl) {
    count = 4;
  } else if (screens.xl) {
    count = 3;
  }

  const getFields = () => {
    const children = [];
    formItems.forEach((item, i) => {
      let initialValue = '';
      const placeholder = item.placeholder || '';
      let component = (
        <Input placeholder={placeholder || `请输入${item.label}`} style={{ width: '100%' }} />
      );
      // 判断类型
      if (item.type === 'select' && item.select) {
        const { select, allItem = true } = item;
        initialValue = select.defaultValue || '';
        component = (
          <Select
            showSearch
            optionFilterProp="children"
            loading={item.loading}
            style={{ width: '100%' }}
            placeholder={item.placeholder || `请选择`}
          >
            {allItem && <Option value={initialValue}>全部</Option>}
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
            disabledDate={item.disabledDate || disabledDate}
            ranges={item.ranges || item.disabledDate ? '' : ranges}
            // renderExtraFooter={() => (
            //   <div className={styles.shop_dateInfo}>
            //     开始时间：选择日期的 00：00：00，结束时间：选择日期的 23：59：59
            //   </div>
            // )}
          />
        );
      }
      if (item.type === 'datePicker') {
        component = (
          <DatePicker style={{ width: '100%' }} allowClear={false} picker={item.picker || 'date'} />
        );
      }
      if (item.type === 'city') {
        component = (
          <Cascader
            changeOnSelect={item.changeOnSelect || false}
            disabled={item.disabled}
            options={item.options || CITYJSON}
            expandTrigger="hover"
            showSearch={{ filter }}
            placeholder="选择城市"
          />
        );
      }

      const colcount = expand ? len : count;

      children.push(
        <Col
          // span={componentSize !== 'default' ? (item.type === 'rangePicker' ? 9 : 6) : 6}
          lg={componentSize !== 'default' ? 8 : i < colcount ? 12 : 0}
          xl={item.type === 'rangePicker' || item.type === 'datePicker' ? 10 : i < colcount ? 8 : 0}
          xxl={componentSize !== 'default' ? 8 : i < colcount ? 6 : 0}
          key={i}
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
        if (item.type === 'datePicker') {
          formObj[item.name] = values[item.name].format(
            item.picker === 'year' ? 'YYYY' : 'YYYY-MM-DD',
          );
        } else if (item.type === 'rangePicker' && item.end && !!values[item.name].length) {
          formObj[item.name] = values[item.name][0].format('YYYY-MM-DD');
          formObj[item.end] = values[item.name][1].format('YYYY-MM-DD');
        } else if (item.type === 'city') {
          item.valuesKey.map((item, i) => (formObj[item] = values.city[i]));
          delete values[item.name];
        }
      } else {
        delete values[item.name];
      }
    });
    if (NoSearch) {
      if (Object.keys(values).length) {
        handleSearch({ ...values, ...formObj });
      }
    } else {
      handleSearch({ ...values, ...formObj });
    }
  };

  const handleReset = () => {
    form.resetFields();
  };

  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, []);

  const toggle = () => setExpand(!expand);

  const search = () => {
    return (
      <div style={{ textAlign: 'right' }}>
        <Space>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
          <Button onClick={handleReset}>重置</Button>
          {btnExtra}
        </Space>
        {len > (componentSize !== 'default' ? 6 : count) ? (
          <a style={{ marginLeft: 8, fontSize: 12 }} onClick={toggle}>
            {expand ? '收起' : '展开'}
            {expand ? <UpOutlined /> : <DownOutlined />}
          </a>
        ) : null}
      </div>
    );
  };

  return (
    <Form
      form={form}
      initialValues={initialValues}
      size={componentSize}
      layout="horizontal"
      className={styles.form}
      onFinish={handleSearchsOver}
    >
      <div style={{ display: 'flex' }}>
        <Row gutter={24} style={{ flex: 1, padding: '0 10px' }}>
          {getFields()}
        </Row>
        {search()}
      </div>
    </Form>
  );
};

export default SearchCondition;
