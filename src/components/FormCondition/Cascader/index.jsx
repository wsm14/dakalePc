import React from 'react';
import CITYJSON from '@/common/city';
import { Cascader } from 'antd';

// Cascader搜索筛选
const filter = (inputValue, path, label = 'label') => {
  return path.some((option) => option[label].indexOf(inputValue) > -1);
};

const CascaderBlock = (props) => {
  const { select, label, placeholder, onChange = undefined, fieldNames } = props;

  return (
    <Cascader
      allowClear={false}
      options={select || CITYJSON}
      expandTrigger="hover"
      onChange={(val, option) => {
        if (onChange) onChange(option);
      }}
      showSearch={{
        filter: (inputValue, path) =>
          filter(inputValue, path, fieldNames ? fieldNames.label : 'label'),
      }}
      placeholder={placeholder || `请选择${label}`}
      {...props}
    />
  );
};

export default CascaderBlock;
