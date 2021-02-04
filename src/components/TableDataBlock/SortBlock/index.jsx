import React from 'react';
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import { MenuOutlined } from '@ant-design/icons';
import './style.less';

/**
 *
 */

//  替换表格行
const SortableItem = sortableElement((props) => <tr {...props} />);

//  替换内容
const SortableContainer = sortableContainer((props) => <tbody {...props} />);

const onSortEnd = ({ oldIndex, newIndex }, dataSource, callback) => {
    console.log('dataSource', dataSource);
    if (oldIndex !== newIndex) {
    const newData = arrayMove([].concat(dataSource), oldIndex, newIndex).filter((el) => !!el);
    console.log('Sorted items: ', newData);
    callback && callback(newData);
  }
};

//  拖拽按钮
export const DragHandle = sortableHandle(() => {
  return (
    <MenuOutlined style={{ cursor: 'move', color: '#999', pointerEvents: 'bounding-box' }} />
  );
});

// 表格替换区域
export const DraggableContainer = (props, dataSource, callback) => (
  <SortableContainer
    useDragHandle
    disableAutoscroll
    helperClass={'row-dragging'}
    onSortEnd={(row) => onSortEnd(row, dataSource, callback)}
    {...props}
  />
);

// 表格替换行
export const DraggableBodyRow = ({ className, style, ...restProps }, dataSource, key) => {
  // function findIndex base on Table rowKey props and should always be a right array index
  const index = dataSource.findIndex((x) => {
    return x[key] == restProps['data-row-key'];
  });
  return <SortableItem index={index} {...restProps} />;
};

export default (dataSource, { key, onSortEnd: callback }) => ({
  components: {
    body: {
      wrapper: (wrapper) => DraggableContainer(wrapper, dataSource, callback),
      row: (row) => DraggableBodyRow(row, dataSource, key),
    },
  },
});
