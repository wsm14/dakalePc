import React from 'react';
import lodash from 'lodash';
import { Checkbox, Spin } from 'antd';

const CheckboxBlock = (props) => {
  const { select, loading, fieldNames = {} } = props;

  const { label = 'label', value = 'value', disabled = 'disabled' } = fieldNames;

  // 遍历对象
  const arrObject = (obj) => {
    return Object.keys(obj).map((item) => ({
      label: item,
      value: obj[item],
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
        value: item[value],
        disabled: item[disabled] || false,
      }));
      return;
    }
    selectList = select;
  } else if (lodash.isPlainObject(select)) {
    // 若为对象则将遍历成数组赋值
    selectList = arrObject(select);
  }

  return loading ? <Spin /> : <Checkbox.Group options={selectList} {...props} />;
};

export default CheckboxBlock;
