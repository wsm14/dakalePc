import React, { useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import './index.less';

const DndDragContext = (props) => {
  const { data = [], accept, onEnd, children } = props;

  // 移动数据处理
  const moveRow = (dragIndex, hoverIndex) => {
    const dragRow = data[dragIndex];
    console.log(dragIndex, hoverIndex, dragRow);
    const movefile = update(data, {
      $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, dragRow],
      ],
    });
    onEnd(movefile);
  };

  // 拖动项目
  const DragableUploadListItem = ({ originNode, index }) => {
    const ref = useRef();
    // accept 拖拽对象落点的属性 区分拖拽对象的不同落点区域 与useDrag type对应
    const [{ isOver, dropClassName }, drop] = useDrop({
      accept,
      collect: (monitor) => {
        const { index: dragIndex } = monitor.getItem() || {};
        if (dragIndex === index) {
          return {};
        }
        return {
          isOver: monitor.isOver(),
          dropClassName: dragIndex < index ? ' drop-over-downward' : ' drop-over-upward',
        };
      },
      drop: (item) => moveRow(item.index, index),
    });
    // type 拖拽对象落点的属性 区分拖拽对象的不同落点区域 与useDrop accept对应
    const [, drag] = useDrag({
      item: { type: accept, index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    drop(drag(ref));

    return (
      <span
        ref={ref}
        className={`dakale-draggable-list-item ${isOver ? dropClassName : ''}`}
        style={{ cursor: 'move' }}
      >
        {originNode}
      </span>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="dakale-move-dom-wrapper">
        {children.map((item, index) => (
          <DragableUploadListItem
            key={`domDnd${index}`}
            originNode={item}
            index={index}
          ></DragableUploadListItem>
        ))}
      </div>
    </DndProvider>
  );
};

export default DndDragContext;
