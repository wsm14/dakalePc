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
    cityType = 'district',
  } = props;
  const { label = 'label' } = fieldNames;
  const divProps = delectProps(props);
  // 默认城市数据
  const detaulData = {
    province: CITYJSON.map((item) => ({ ...item, children: undefined })),
    city: CITYJSON.map((item) => ({
      ...item,
      children: item.children.map((citem) => ({ ...citem, children: undefined })),
    })),
    district: CITYJSON,
  }[cityType];

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
      options={select || detaulData}
      onChange={(val, options) => {
        if (onChange) onChange(val, options);
      }}
    />
  );
};

export default CascaderBlock;
