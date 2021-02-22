import React from 'react';
import lodash from 'lodash';
import { Select, Spin, Empty } from 'antd';

/**
 * 选择器
 */
const { Option } = Select;

const SelectBlock = (props) => {
  const { type, select, allItem = true, fieldNames = {}, loading, placeholder, label } = props;

  const initialValue = select.defaultValue || '';
  const { labelKey = 'name', valueKey = 'value', tipKey = 'otherData' } = fieldNames;

  // 遍历对象
  const arrObject = (obj) => {
    return Object.keys(obj).map((item) => ({
      [labelKey]: obj[item],
      [valueKey]: item,
    }));
  };

  /**
   *  判断传入select 类型
   *  { list: [] } | { list: {} } | [] | {}
   */
  let selectList = [];
  if (Array.isArray(select)) {
    selectList = select;
  } else if (lodash.isPlainObject(select)) {
    if (Array.isArray(select.list)) {
      // 若为数组
      selectList = select.list;
    } else if (select.list && lodash.isPlainObject(select.list)) {
      // 若为对象则将遍历成数组赋值
      selectList = arrObject(select.list);
    } else {
      // 若为对象则将遍历成数组赋值
      selectList = arrObject(select);
    }
  }

  // type === multiple 配置
  let multProps = {};
  if (type === 'multiple') multProps = { maxTagCount: 2, maxTagTextLength: 2 };

  // 返回结果
  return (
    <Select
      allowClear
      showSearch
      mode={type}
      optionFilterProp="children"
      dropdownMatchSelectWidth={false}
      style={{ width: '100%' }}
      notFoundContent={
        loading ? <Spin size="small" /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      }
      placeholder={placeholder || `请选择${label}`}
      {...multProps}
      {...props}
    >
      {allItem && <Option value={initialValue}>全部</Option>}
      {selectList.map((data, j) => {
        if (data) {
          // 兼容数组
          const valueData = !data[valueKey] ? `${j}` : data[valueKey];
          const nameData = data[valueKey] ? data[labelKey] : data;
          const otherData = data[tipKey] ? data[tipKey] : '';
          return (
            <Option key={j} value={valueData}>
              {nameData}
              {otherData && <div style={{ fontSize: 12, color: '#989898' }}>{otherData}</div>}
            </Option>
          );
        }
      })}
    </Select>
  );
};

export default SelectBlock;
