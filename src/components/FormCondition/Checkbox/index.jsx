import React from 'react';
import lodash from 'lodash';
import { Checkbox, Spin } from 'antd';
import { delectProps } from '../utils';

const CheckboxBlock = (props) => {
  const { select = [], fieldNames = {}, loading } = props;

  const divProps = delectProps(props);
  const { label = 'label', value = 'value', disabled = 'disabled' } = fieldNames;
  // 遍历对象
  const arrObject = (obj) => {
    return Object.keys(obj).map((item) => ({
      label: obj[item],
      value: `${item}`,
    }));
  };

  /**
   *  判断传入select 类型
   *  [] | {}
   */
  let selectList = [];
  if (Array.isArray(select)) {
    if (select[0] && lodash.isPlainObject(select[0])) {
      selectList = select.map((item) => ({
        label: item[label],
        value: `${item[value]}`,
        disabled: item[disabled] || false,
      }));
    } else {
      selectList = select
        .map((item, index) => (item ? { label: item, value: `${index}` } : null))
        .filter((i) => i);
    }
  } else if (lodash.isPlainObject(select)) {
    // 若为对象则将遍历成数组赋值
    selectList = arrObject(select);
  }
  return loading ? <Spin /> : <Checkbox.Group options={selectList} {...divProps} />;
};

export default CheckboxBlock;
