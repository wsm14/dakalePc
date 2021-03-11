import React from 'react';
import CITYJSON from '@/common/city';
import { Cascader } from 'antd';
import { delectProps } from '../utils';

// Cascader搜索筛选
const filter = (inputValue, path, label = 'label') => {
  return path.some((option) => option[label].indexOf(inputValue) > -1);
};

const CascaderBlock = (props) => {
  const {
    select,
    label: plabel = '',
    placeholder,
    disabled,
    changeOnSelect = false,
    fieldNames = {},
    onChange,
  } = props;

  const { label = 'label' } = fieldNames;
  const divProps = delectProps(props);

  return (
    <Cascader
      {...divProps}
      allowClear={false}
      expandTrigger="hover"
      showSearch={{
        filter: (inputValue, path) => filter(inputValue, path, label),
      }}
      disabled={disabled}
      changeOnSelect={changeOnSelect}
      fieldNames={fieldNames}
      placeholder={placeholder || `请选择${plabel}`}
      options={select || CITYJSON}
      onChange={(val, options) => {
        if (onChange) onChange(val, options);
      }}
    />
  );
};

export default CascaderBlock;
