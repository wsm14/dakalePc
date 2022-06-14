import React, { useState } from 'react';
import { Searchor } from './searchModule';
import { Form, Row, Col, Button, Space, Grid } from 'antd';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import ExtraButton from '@/components/ExtraButton';
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
    btnExtra = [],
    componentSize = 'default',
    initialValues = {},
  } = props;

  const [ownForm] = Form.useForm();

  const screens = useBreakpoint(); // 动态获取当前屏幕大小
  const [expand, setExpand] = useState(componentSize !== 'default' ? true : false); // 展开状态

  // 重置
  const handleReset = () => {
    (form || ownForm).resetFields();
    if (resetSearch) resetSearch();
  };

  // 获取参数
  const getData = () => {
    return handleSearchsOver((form || ownForm).getFieldsValue(), 'data');
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
          if (picker === 'year') {
            formObj[name] = values[name].format('YYYY');
          } else if (picker === 'month') {
            formObj[name] = values[name].format('YYYY-MM');
          } else {
            formObj[name] = values[name].format('YYYY-MM-DD');
          }
        } else if (type === 'rangePicker' && end && !!values[name].length) {
          // 区间时间类型
          formObj[name] = values[name][0].format('YYYY-MM-DD');
          formObj[end] = values[name][1].format('YYYY-MM-DD');
        } else if (type === 'multiple') {
          // 多选框字符串传递
          formObj[name] = values[name].toString();
        } else if (type === 'cascader') {
          const { valuesKey } = item;
          // 级联处理
          if (valuesKey) valuesKey.map((key, i) => (formObj[key] = values[name][i]));
          else formObj[name] = values[name][values[name].length - 1];
          delete values[name];
        } else if (type === 'numberGroup') {
          // 数字区间组合
          formObj[name] =
            values[name] && values[name].filter((i) => typeof i == 'number').length === 2
              ? values[name].join(',')
              : undefined;
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

  const len = formItems.filter(({ show = true }) => show).length;

  // 不同屏幕大小显示个数
  let count = 4;
  if (screens.xxl) {
    count = 3;
  } else if (screens.xl) {
    count = 2;
  } else if (screens.lg) {
    count = 4;
  }

  const getFields = () => {
    const children = [];
    formItems
      .filter(({ show = true }) => show)
      .forEach((item, i) => {
        const {
          type = 'input',
          name,
          handle,
          label,
          col = true,
          required = false,
          rules: rs = [],
          ...other
        } = item;
        // 根据类型获取不同的表单组件
        const SearchItem = Searchor[type];

        // 规则 默认必填
        const rules = [{ required, message: `请确认${label}` }, ...rs];

        const colcount = expand ? len : count;
        const block = (
          <FormItem label={label} style={{ paddingBottom: 8 }} name={name} rules={rules}>
            <SearchItem
              type={type}
              label={label}
              name={name}
              {...other}
              {...(handle && handle(form || ownForm))}
            ></SearchItem>
          </FormItem>
        );

        if (col) {
          // 排版填充
          children.push(
            <Col span={i < colcount ? 24 / count : 0} key={i}>
              {block}
            </Col>,
          );
        } else
          children.push(
            <Col span={24 / count} key={i}>
              {block}
            </Col>,
          );
      });
    children.push(
      expand && (
        <Col flex={1} key="searchkey">
          {search}
        </Col>
      ),
    );
    return children;
  };

  // 搜索按钮
  const search = (
    <div style={{ textAlign: 'right', marginBottom: 24 }}>
      <Space>
        <Button type="primary" htmlType="submit">
          查询
        </Button>
        <Button onClick={handleReset}>重置</Button>
        <ExtraButton
          list={typeof btnExtra == 'function' ? btnExtra({ get: getData }) : btnExtra}
        ></ExtraButton>
      </Space>
      {len > (componentSize !== 'default' ? 6 : count) ? (
        <a style={{ fontSize: 12 }} onClick={() => setExpand(!expand)}>
          {expand ? '收起' : '展开'}
          {expand ? <UpOutlined /> : <DownOutlined />}
        </a>
      ) : null}
    </div>
  );

  return (
    <Form
      form={form || ownForm}
      initialValues={initialValues}
      size={componentSize}
      layout="horizontal"
      className={styles.formSearch}
      onFinish={handleSearchsOver}
    >
      <Row gutter={[12, 0]}>
        <Col flex={1}>
          <Row gutter={[12, 0]}>{getFields()}</Row>
        </Col>
        {!expand && <Col>{search}</Col>}
      </Row>
    </Form>
  );
};

export default SearchCondition;
