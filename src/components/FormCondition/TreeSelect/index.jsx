import React from 'react';
import { TreeSelect } from 'antd';
import { delectProps } from '../utils';

const { TreeNode } = TreeSelect;

const TreeSelectBlock = (props) => {
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
        item={item}
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
      treeNodeFilterProp="title"
      onChange={(val, options, extra) => {
        console.log(val, options, extra);
        if (onChange) onChange(val, options, extra);
      }}
    >
      {mapTreeDom(select)}
    </TreeSelect>
  );
};

export default TreeSelectBlock;
