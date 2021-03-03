import React from 'react';
import lodash from 'lodash';
import { Select, Spin, Empty } from 'antd';
import { delectProps } from '../utils';

const SelectBlock = (props) => {
  const { type, select, label: plabel, loading, placeholder, fieldNames = {} } = props;

  const divProps = delectProps(props);
  const { label = 'name', value = 'value', tip = 'otherData' } = fieldNames;

  // 遍历对象
  const arrObject = (obj) => {
    return Object.keys(obj).map((item) => ({
      [label]: obj[item],
      [value]: item,
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
      style={{ width: '100%' }}
      optionFilterProp="children"
      notFoundContent={
        loading ? <Spin size="small" /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      }
      loading={loading}
      {...multProps}
      {...divProps}
      placeholder={placeholder || `请选择${plabel}`}
    >
      {selectList.map((data, j) => {
        if (data) {
          const nameD = data[label];
          // 兼容数组
          const valueData = !data[value] ? `${j}` : data[value];
          const nameData = nameD ? nameD : typeof data == 'string' ? data : '--';
          const otherData = data[tip] ? data[tip] : '';
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
