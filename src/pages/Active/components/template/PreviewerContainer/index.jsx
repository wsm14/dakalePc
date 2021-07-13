import React, { useContext, useMemo } from 'react';
import { useDrop } from 'react-dnd';
import update from 'immutability-helper';
import PreviewerActive from './PreviewerActive';
import styles from './style.less';

// 放置接受组件 index  放置时的下标
const BasketDom = ({ index, cardList, styBasket, setStyBasket, changeCardList }) => {
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: 'Card',
    drop: (dropItem) => {
      setStyBasket(false);
      /**
       * 拖拽结束时，判断是否将拖拽元素放入了目标接收组件中
       *  1、如果是，则使用真正传入的 box 元素代替占位元素
       */
      // 更新 cardList 数据源
      changeCardList([...cardList, dropItem]);
    }, // 放置方法
    collect: (monitor) => ({ isOver: monitor.isOver(), canDrop: monitor.canDrop() }),
  });
  return (
    <div
      ref={drop}
      className={`${styles.previewer_basket} ${styBasket ? styles.show : ''}`}
      style={canDrop && isOver ? { background: '#00ff0814', color: '#239c1b' } : {}}
    >
      {canDrop && isOver ? '确认放置此处' : '将模块放置于此'}
    </div>
  );
};

const ActiveTemplateIframe = (props) => {
  const { context, cardList } = props;
  const { info, showPanel, moduleData } = useContext(context);

  const { data } = moduleData;

  return (
    <div className={styles.active_Template_content}>
      <div className={styles.previewer_component}>
        <PreviewerActive activeInfo={showPanel}></PreviewerActive>
        <div
          id="previewer_wrap"
          className={styles.previewer_wrap}
          style={{ backgroundColor: moduleData['backgroundColor'] }}
        >
          <BasketDom index={0} {...props}></BasketDom>
          {cardList.map((item, index) => (
            <React.Fragment key={`${index}`}>
              <div key={index}>{JSON.stringify(item)}</div>
              <BasketDom index={index + 1} {...props}></BasketDom>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActiveTemplateIframe;
