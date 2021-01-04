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
  Empty,
  Spin,
} from 'antd';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import CITYJSON from '@/common/city';
import styles from './index.less';

/**
 *
 * @searchItems {*} 搜索数组
 * @handleSearch {*} 搜索回调
 * @btnExtra {*} 额外按钮
 * @componentSize {*} 组件大小
 * @initialValues {*} 默认值
 * @NoSearch {*} 无搜索内容时 不搜索
 */

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
    resetSearch = () => {},
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
    count = 2;
  }

  const getFields = () => {
    const children = [];
    formItems.forEach((item, i) => {
      let initialValue = '';
      const placeholder = item.placeholder || '';
      let component = (
        <Input
          placeholder={placeholder || `请输入${item.label}`}
          style={{ width: '100%' }}
          allowClear
        />
      );
      // 判断类型
      if (item.type === 'select' && item.select) {
        const { select, allItem = true } = item;
        initialValue = select.defaultValue || '';
        const selectList = Array.isArray(select) ? select : select.list;
        component = (
          <Select
            allowClear
            showSearch
            optionFilterProp="children"
            loading={item.loading}
            style={{ width: '100%' }}
            onSearch={item.onSearch}
            onChange={item.onChange}
            onFocus={item.onFocus}
            dropdownMatchSelectWidth={false}
            notFoundContent={
              item.loading ? <Spin size="small" /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            }
            placeholder={item.placeholder || `请选择`}
          >
            {allItem && <Option value={initialValue}>全部</Option>}
            {selectList.map((data, j) => {
              if (data) {
                // 兼容数组
                const value = !data.value ? `${j}` : data.value;
                const name = data.value ? data.name : data;
                const otherData = data.otherData ? data.otherData : '';
                return (
                  <Option key={j} value={value}>
                    {name}
                    {otherData && <div style={{ fontSize: 12, color: '#989898' }}>{otherData}</div>}
                  </Option>
                );
              }
            })}
          </Select>
        );
      }
      if (item.type === 'multiple' && item.select) {
        const { select, allItem = false } = item;
        initialValue = select.defaultValue || '';
        component = (
          <Select
            allowClear
            showSearch
            mode="multiple"
            defaultActiveFirstOption={false}
            filterOption={true}
            optionFilterProp="children"
            loading={item.loading}
            notFoundContent={
              item.loading ? <Spin size="small" /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            }
            style={{ width: '100%' }}
            maxTagCount={2}
            maxTagTextLength={2}
            onSearch={item.onSearch}
            onChange={item.onChange}
            placeholder={item.placeholder || `请选择`}
            disabled={item.disabled}
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
        component = <InputNumber placeholder={placeholder} style={{ width: '100%' }} allowClear />;
      }

      // 时间区间搜索
      if (item.type === 'rangePicker') {
        initialValue = item.defaultValue || [];
        component = (
          <RangePicker
            allowClear
            style={{ width: '100%' }}
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

      // 时间搜索 picker
      if (item.type === 'datePicker') {
        component = (
          <DatePicker
            style={{ width: '100%' }}
            picker={item.picker || 'date'}
            allowClear
          />
        );
      }

      // 城市类型
      if (item.type === 'cascader') {
        component = (
          <Cascader
            allowClear
            changeOnSelect={item.changeOnSelect || false}
            disabled={item.disabled}
            options={item.options || CITYJSON}
            expandTrigger="hover"
            showSearch={{ filter }}
            fieldNames={item.fieldNames}
            placeholder={item.placeholder || '选择城市'}
            onChange={item.onChange}
          />
        );
      }

      const colcount = expand ? len : count;
      const pickerCheck = (item.type === 'rangePicker' || item.type === 'datePicker') && len < 4;
      // 排版填充
      children.push(
        <Col
          lg={pickerCheck ? 10 : componentSize !== 'default' ? 8 : i < colcount ? 12 : 0}
          xl={pickerCheck ? 10 : i < colcount ? 12 : 0}
          xxl={pickerCheck ? 8 : componentSize !== 'default' ? 8 : i < colcount ? 6 : 0}
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

  // 搜索
  const handleSearchsOver = (values, type) => {
    const formObj = {};
    formItems.forEach((item) => {
      if (values[item.name]) {
        // 判断类型 时间类型处理
        if (item.type === 'datePicker') {
          formObj[item.name] = values[item.name].format(
            item.picker === 'year' ? 'YYYY' : 'YYYY-MM-DD',
          );
        } else if (item.type === 'rangePicker' && item.end && !!values[item.name].length) {
          formObj[item.name] = values[item.name][0].format('YYYY-MM-DD');
          formObj[item.end] = values[item.name][1].format('YYYY-MM-DD');
        } else if (item.type === 'multiple') {
          // 判断类型 多选框字符串传递
          formObj[item.name] = values[item.name].toString();
        } else if (item.type === 'cascader') {
          // 判断类型 城市类型处理
          item.valuesKey.map((key, i) => (formObj[key] = values[item.name][i]));
          delete values[item.name];
        }
      } else {
        // 删除不存在值的key
        delete values[item.name];
      }
    });
    if (type == 'data') return { ...values, ...formObj };
    if (NoSearch) {
      // 搜索回调
      // NoSearch为true时 无搜索值的不请求
      if (Object.keys(values).length) {
        handleSearch({ ...values, ...formObj });
      }
    } else {
      // 默认请求
      handleSearch({ ...values, ...formObj });
    }
  };

  const getData = () => {
    return handleSearchsOver(form.getFieldsValue(), 'data');
  };

  // 重置
  const handleReset = () => {
    form.resetFields();
    if (resetSearch) resetSearch();
  };

  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, []);

  // 展开
  const toggle = () => setExpand(!expand);

  const search = () => {
    return (
      <div style={{ textAlign: 'right' }}>
        <Space>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
          <Button onClick={handleReset}>重置</Button>
          {typeof btnExtra == 'function' ? btnExtra({ get: getData }) : btnExtra}
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
