import React, { useEffect } from 'react';
import CITYJSON from '@/common/city';
import { Cascader } from 'antd';

// Cascader搜索筛选
const filter = (inputValue, path, label = 'label') => {
  return path.some((option) => option[label].indexOf(inputValue) > -1);
};

const CascaderBlock = (props) => {
  const {
    form,
    name,
    select,
    label,
    placeholder,
    disabled,
    changeOnSelect = false,
    onChange = undefined,
    fieldNames,
    value = [],
  } = props;

  useEffect(() => {
    const valueData = typeof value[0] === 'object' ? value.map((i) => i.value) : value;
    form.setFieldsValue({ [name]: valueData });
  }, [value]);

  return (
    <Cascader
      value={value}
      allowClear={false}
      expandTrigger="hover"
      showSearch={{
        filter: (inputValue, path) =>
          filter(inputValue, path, fieldNames ? fieldNames.label : 'label'),
      }}
      disabled={disabled}
      changeOnSelect={changeOnSelect}
      fieldNames={fieldNames}
      placeholder={placeholder || `请选择${label}`}
      options={select || CITYJSON}
      onChange={(val, option) => {
        if (onChange) onChange(option);
      }}
    />
  );
};

export default CascaderBlock;
