import React, { useState } from 'react';
import { Searchor } from './searchModule';
import { Form, Row, Col, Button, Space, Grid } from 'antd';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import styles from './index.less';

/**
 *
 * @searchItems {*} 搜索数组
 * @handleSearch {*} 搜索回调
 * @btnExtra {*} 额外按钮
 * @componentSize {*} 组件大小
 * @initialValues {*} 默认值
 */

const FormItem = Form.Item;
const { useBreakpoint } = Grid;

const SearchCondition = (props) => {
  const {
    form,
    searchItems: formItems,
    resetSearch = () => {},
    handleSearch,
    btnExtra = '',
    componentSize = 'default',
    initialValues = {},
  } = props;

  const [ownForm] = Form.useForm();
  // 外部传递form优先
  const searchForm = form || ownForm;
  // 动态获取当前屏幕大小
  const screens = useBreakpoint();
  // 展开状态
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
      const { type = 'input', name, handle } = item;
      // 根据类型获取不同的表单组件
      const SearchItem = Searchor[type];

      const colcount = expand ? len : count;
      const pickerCheck = (item.type === 'rangePicker' || item.type === 'datePicker') && len < 4;
      // 排版填充
      children.push(
        <Col
          lg={i < colcount ? (pickerCheck ? 10 : componentSize !== 'default' ? 8 : 12) : 0}
          xl={i < colcount ? (pickerCheck ? 10 : 12) : 0}
          xxl={i < colcount ? (pickerCheck ? 8 : componentSize !== 'default' ? 8 : 6) : 0}
          key={i}
        >
          <FormItem label={item.label} style={{ paddingBottom: 8 }} name={name}>
            <SearchItem {...item} {...(handle && handle(searchForm))}></SearchItem>
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
      const { type, name, end, picker } = item;
      if (values[name]) {
        // 过滤单引号 (因为后端会报错)
        if (typeof values[name] === 'string') {
          formObj[name] = values[name].replace(/'/g, '');
        }
        // 判断类型
        // 时间类型处理
        if (type === 'datePicker') {
          formObj[name] = values[name].format(picker === 'year' ? 'YYYY' : 'YYYY-MM-DD');
        } else if (type === 'rangePicker' && end && !!values[name].length) {
          // 区间时间类型
          formObj[name] = values[name][0].format('YYYY-MM-DD');
          formObj[end] = values[name][1].format('YYYY-MM-DD');
        } else if (type === 'multiple') {
          // 多选框字符串传递
          formObj[name] = values[name].toString();
        } else if (type === 'cascader') {
          const { valueskey } = item;
          // 级联处理
          if (valueskey) valueskey.map((key, i) => (formObj[key] = values[name][i]));
          else formObj[name] = values[name][values[name].length - 1];
          delete values[name];
        }
      } else {
        // 删除不存在值的key
        delete values[name];
      }
    });
    // 直接返回搜素参数
    if (type == 'data') return { ...values, ...formObj };
    // 搜索回调
    handleSearch({ ...values, ...formObj });
  };

  // 获取参数
  const getData = () => {
    return handleSearchsOver(searchForm.getFieldsValue(), 'data');
  };

  // 重置
  const handleReset = () => {
    searchForm.resetFields();
    if (resetSearch) resetSearch();
  };

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
      form={searchForm}
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
