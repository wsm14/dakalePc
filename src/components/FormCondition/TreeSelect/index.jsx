import React from 'react';
import { TreeSelect } from 'antd';
import { delectProps } from '../utils';

const { TreeNode } = TreeSelect;

// Cascader搜索筛选
const filter = (inputValue, path, label = 'label') => {
  return path.some((option) => option[label].indexOf(inputValue) > -1);
};

const CascaderBlock = (props) => {
  const { label: plabel, select = [], placeholder, fieldNames = {}, onChange } = props;

  const {
    label = 'name',
    value = 'value',
    children = 'children',
    disabled = 'disabled',
  } = fieldNames;
  const divProps = delectProps(props);

  const mapTreeDom = (list) =>
    list.map((item) => (
      <TreeNode
        key={item[value]}
        value={item[value]}
        title={item[label]}
        disabled={item[disabled] || (item[children] && item[children].length)}
      >
        {item[children] && item[children].length && mapTreeDom(item[children])}
      </TreeNode>
    ));

  return (
    <TreeSelect
      {...divProps}
      placeholder={placeholder || `请选择${plabel}`}
      style={{ width: '100%' }}
      treeDefaultExpandAll
      filterTreeNode={(inputValue, path) => filter(inputValue, path, label)}
      onChange={(val, options) => {
        console.log(val, options);
        if (onChange) onChange(val, options);
      }}
    >
      {mapTreeDom(select)}
    </TreeSelect>
  );
};

export default CascaderBlock;
