import React from 'react';
import { Cascader } from 'antd';
import CITYJSON from '@/common/city';

/**
 * 级联选择
 */

// Cascader搜索筛选
const filter = (inputValue, path, label = 'label') => {
  return path.some((option) => option[label].indexOf(inputValue) > -1);
};

const CascaderBlock = (props) => {
  const { form, select, placeholder, label, fieldNames, onChange } = props;

  const divProps = Object.assign({}, props);
  delete divProps.valuesKey;

  // 返回结果
  return (
    <Cascader
      allowClear
      expandTrigger="hover"
      options={select || CITYJSON}
      placeholder={placeholder || `选择${label || '城市'}`}
      showSearch={{
        filter: (inputValue, path) =>
          filter(inputValue, path, fieldNames ? fieldNames.label : 'label'),
      }}
      onChange={(val) => onChange && onChange(val, form)}
      {...divProps}
    />
  );
};

export default CascaderBlock;
