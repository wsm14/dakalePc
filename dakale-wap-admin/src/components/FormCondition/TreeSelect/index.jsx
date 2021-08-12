import React from 'react';
import { TreeSelect } from 'antd';
import { delectProps } from '../utils';

const { TreeNode } = TreeSelect;

const TreeSelectBlock = (props) => {
  const {
    label: plabel,
    select = [],
    placeholder,
    fieldNames = {},
    showTitle = true,
    onChange,
  } = props;

  const {
    label = 'name',
    value = 'value',
    children = 'children',
    disabled = 'disabled',
  } = fieldNames;

  const divProps = delectProps(props);

  const mapTreeDom = (list, pName) =>
    list.map((item) => (
      <TreeNode
        item={item}
        key={item[value]}
        showName={`${pName} - ${item[label]}`}
        value={item[value]}
        title={item[label]}
        disabled={item[disabled] || (item[children] && item[children].length)}
      >
        {item[children] && item[children].length && mapTreeDom(item[children], item[label])}
      </TreeNode>
    ));

  return (
    <TreeSelect
      {...divProps}
      placeholder={placeholder || `请选择${plabel}`}
      style={{ width: '100%' }}
      treeDefaultExpandAll
      treeNodeLabelProp={showTitle ? 'showName' : 'title'}
      treeNodeFilterProp="title"
      onChange={(val, options, extra) => {
        console.log(val, 'options', options, 'extra', extra);
        if (onChange) onChange(val, options, extra);
      }}
    >
      {mapTreeDom(select)}
    </TreeSelect>
  );
};

export default TreeSelectBlock;
