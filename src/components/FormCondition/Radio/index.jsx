import React from 'react';
import lodash from 'lodash';
import { Radio } from 'antd';
import { delectProps } from '../utils';

const RadioBlock = (props) => {
  const { select, fieldNames = {}, onChange, dataOnChange } = props;

  const divProps = delectProps(props);
  const { label = 'name', value = 'value', disabled = 'disabled' } = fieldNames;

  // 遍历对象
  const arrObject = (obj) => {
    return Object.keys(obj).map((item) => ({
      label: obj[item],
      value: `${item}`,
    }));
  };

  /**
   * select 类型
   * [{ }] | [] |  { label: string; value: string; disabled?: boolean; }
   */
  let selectList = [];
  if (Array.isArray(select)) {
    if (lodash.isPlainObject(select[0])) {
      selectList = select.map((item) => ({
        label: item[label],
        value: `${item[value]}`,
        disabled: item[disabled] || false,
      }));
    } else selectList = select.map((item, index) => ({ label: item, value: `${index}` }));
  } else if (lodash.isPlainObject(select)) {
    // 若为对象则将遍历成数组赋值
    selectList = arrObject(select);
  }

  return (
    <Radio.Group
      {...divProps}
      onChange={(e) => {
        onChange(e);
        dataOnChange && dataOnChange(e);
      }}
      options={selectList}
    ></Radio.Group>
  );
};

export default RadioBlock;
