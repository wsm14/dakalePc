import React from 'react';
import lodash from 'lodash';
import { Select, Spin, Empty } from 'antd';

const SelectBlock = (props) => {
  const { type, select, label, loading, placeholder, fieldNames = {} } = props;

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
   *  [] | {}
   */
  let selectList = [];
  if (Array.isArray(select)) {
    selectList = select;
  } else if (lodash.isPlainObject(select)) {
    // 若为对象则将遍历成数组赋值
    selectList = arrObject(select);
  }

  // type === tags 配置
  let multProps = {};
  if (type === 'tags') multProps = { mode: 'tags', tokenSeparators: [',', '，'] };

  return (
    <Select
      showSearch
      defaultActiveFirstOption={false}
      dropdownMatchSelectWidth={false}
      notFoundContent={
        loading ? <Spin size="small" /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      }
      placeholder={placeholder || `请选择${label}`}
      style={{ width: '100%' }}
      optionFilterProp="children"
      {...props}
      {...multProps}
    >
      {selectList.map((data, j) => {
        if (data) {
          const nameD = data[labelKey];
          // 兼容数组
          const valueData = !data[valueKey] ? `${j}` : data[valueKey];
          const nameData = nameD ? nameD : typeof data == 'string' ? data : '--';
          const otherData = data[tipKey] ? data[tipKey] : '';
          return (
            <Select.Option key={valueData} value={valueData}>
              {nameData}
              {otherData && <div style={{ fontSize: 12, color: '#989898' }}>{otherData}</div>}
            </Select.Option>
          );
        }
      })}
    </Select>
  );
};

export default SelectBlock;
