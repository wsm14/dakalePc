import React, { useRef } from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import DragAndDropHOC from '@/components/DndDragContext/DragAndDropHOC';
import DndDragContext from '@/components/DndDragContext';
import update from 'immutability-helper';
import { useDrag, useDrop } from 'react-dnd';
import { CARD } from './ItemType';
import './index.less';
// 拼团商品

export const groupGoods = (item = {}, id, setSelectItem, onDel, index, data = [], onEnd) => {
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

  const ref = useRef(null);

  // 移动数据处理
  const moveRow = (dragIndex, hoverIndex) => {
    console.log(dragIndex, hoverIndex, '111');
    const dragRow = data[dragIndex];
    const movefile = update(data, {
      $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, dragRow],
      ],
    });
    onEnd(movefile);
  };

  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: CARD,
    hover(item, monitor) {
      //异常处理判断
      if (!ref.current) {
        return;
      }
      //拖拽目标的Index
      const dragIndex = item.index;
      //放置目标Index
      const hoverIndex = index;
      // 如果拖拽目标和放置目标相同的话，停止执行
      if (dragIndex === hoverIndex) {
        return;
      }
      //如果不做以下处理，则卡片移动到另一个卡片上就会进行交换，下方处理使得卡片能够在跨过中心线后进行交换.
      //获取卡片的边框矩形
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      //获取X轴中点
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      //获取拖拽目标偏移量
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // 从上往下放置
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // 从下往上放置
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      moveRow(dragIndex, hoverIndex); //调用方法完成交换
      item.index = hoverIndex; //重新赋值index，否则会出现无限交换情况
    },

    // collect: (monitor) => {
    //   const { index: dragIndex } = monitor.getItem() || {};
    //   if (dragIndex === index) {
    //     return {};
    //   }
    //   return {
    //     isOver: monitor.isOver(),
    //     dropClassName: dragIndex < index ? ' drop-over-downward' : ' drop-over-upward',
    //   };
    // },
    // drop: (item) => moveRow(item.index, index),
  });

  const [{ isDragging }, drag] = useDrag({
    item: { type: CARD, id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));

  return (
    <div ref={ref} style={{ width: 350 }} key={activityGoodsId || specialGoodsId}>
      <div
        className={`share_Coupon share_item ${id === specialGoodsId && 'select'}`}
        style={{ marginBottom: 6, opacity }}
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
