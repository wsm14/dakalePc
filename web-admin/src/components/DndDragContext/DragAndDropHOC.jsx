import React, { useRef } from 'react';
import { DndProvider, createDndContext } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const RNDContext = createDndContext(HTML5Backend);

const DragAndDropHOC = (props) => {
  const manager = useRef(RNDContext);
  return <DndProvider manager={manager.current.dragDropManager}>{props.children}</DndProvider>;
};

export default DragAndDropHOC;
