import React, { useEffect } from 'react';
import CITYJSON from '@/common/city';
import { Cascader } from 'antd';

// Cascader搜索筛选
const filter = (inputValue, path, label) => {
  return path.some((option) => option[label].indexOf(inputValue) > -1);
};

const CascaderBlock = (props) => {
  const {
    form,
    name,
    select,
    label: plabel,
    placeholder,
    disabled,
    changeOnSelect = false,
    onChange = undefined,
    fieldNames,
    value: changeValue = [],
  } = props;

  const { label = 'label', value = 'value' } = fieldNames;

  useEffect(() => {
    const valueData =
      typeof changeValue[0] === 'object' ? changeValue.map((i) => i[value]) : changeValue;
    form.setFieldsValue({ [name]: valueData });
  }, [changeValue]);

  return (
    <Cascader
      value={changeValue}
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
      onChange={(val, option) => {
        if (onChange) onChange(option);
      }}
    />
  );
};

export default CascaderBlock;
