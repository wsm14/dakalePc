import React, { useRef } from 'react';
import DragAndDropHOC from '@/components/DndDragContext/DragAndDropHOC';
import DndDragContext from '@/components/DndDragContext';
import update from 'immutability-helper';
import { useDrag, useDrop } from 'react-dnd';
import './index.less';
// 拼团商品

export const groupGoods = (
  item = {},
  id,
  setSelectItem,
  onDel,
  index,
  accept = 'sort',
  data = [],
) => {
  const {
    goodsImg,
    goodsName = '',
    remain,
    specialGoodsId,
    activityGoodsId,
    realPrice,
    oriPrice,
    goodsId,
    name,
  } = item;
  // 移动数据处理
  const moveRow = (dragIndex, hoverIndex) => {
      console.log(dragIndex, hoverIndex,'111')
    const dragRow = data[dragIndex];
    const movefile = update(data, {
      $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, dragRow],
      ],
    });
    // onEnd(movefile);
  };

  const ref = useRef();
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: accept,
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

  const [, drag] = useDrag({
    item: { type: accept, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drag(drop(ref));

  return (
    <div style={{ width: 350 }} key={activityGoodsId || specialGoodsId} ref={ref}>
      <div
        className={`share_Coupon share_item ${id === specialGoodsId && 'select'}`}
        style={{ marginBottom: 6 }}
        onClick={() => setSelectItem && setSelectItem(item)}
      >
        <div
          className="share_left"
          style={{
            width: 76,
            height: 76,
            background: `url(${goodsImg}) 100%/cover`,
          }}
        ></div>
        <div className="share_title" style={{ lineHeight: 1.8 }}>
          <div className="titile">{goodsName}</div>
          <div style={{ color: '#999' }}>ID:{name}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div className="share_tip">
              ¥{realPrice}{' '}
              <span style={{ textDecoration: 'line-through', color: '#9e9e9e' }}>￥{oriPrice}</span>
            </div>
            <div className="share_tip" style={{ color: '#b1b1b1' }}>
              剩余{remain}张
            </div>
          </div>
        </div>
        {!onDel ? (
          <div className="share_select_icon">
            <div className="share_select"></div>
          </div>
        ) : (
          <div className="share_del_icon" onClick={onDel}>
            <DeleteOutlined />
          </div>
        )}
      </div>
    </div>
  );
};
