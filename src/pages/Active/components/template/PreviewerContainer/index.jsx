import React, { useContext } from 'react';
import { useDrop } from 'react-dnd';
import update from 'immutability-helper';
import PreviewerActive from './PreviewerActive';
import styles from './style.less';

/**
 * 放置接收组件
 * @param {Number} index 当前放置的下标
 * @param {Array} data 当前原始数据
 * @param {Boolean} styBasket 放置显示的状态
 * @param {Function} setStyBasket 设置放置显示的状态
 * @param {Function} changeCardList 修改数据方法
 * @param {Function} handleShowEditor 显示编辑数据模组
 * @returns
 */
const BasketDom = ({ index, data, styBasket, setStyBasket, changeCardList, handleShowEditor }) => {
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: 'Card',
    drop: (dropItem) => {
      setStyBasket(false);
      const { icon, editorDom, drop, ...other } = dropItem;
      /**
       * 拖拽结束时，判断是否将拖拽元素放入了目标接收组件中
       *  1、如果是，则使用真正传入的 box 元素代替占位元素
       */
      // 更新 data 数据源
      const movefile = update(data, {
        $splice: [[index, 0, other]],
      });
      changeCardList(movefile);
      handleShowEditor(dropItem, index);
    }, // 放置方法
    collect: (monitor) => ({ isOver: monitor.isOver(), canDrop: monitor.canDrop() }),
  });

  return (
    <div
      ref={drop}
      className={`${styles.previewer_basket} ${styBasket ? styles.show : ''}`}
      style={canDrop && isOver ? { background: '#e0efe2', color: '#239c1b' } : {}}
    >
      {canDrop && isOver ? '确认放置此处' : '将模块放置于此'}
    </div>
  );
};

/**
 * 显示区域
 * @param {Boolean} styBasket 放置显示的状态
 * @param {Function} setStyBasket 设置放置显示的状态
 * @returns
 */
const ActiveTemplateIframe = (props) => {
  const { context, styBasket, setStyBasket } = props;
  const { dispatchData, showPanel, moduleData } = useContext(context);

  const { data } = moduleData;
  console.log(data);
  // 数据变化储存
  const changeCardList = (list) =>
    dispatchData({ type: 'saveModuleData', payload: { data: list } });

  // 显示对应的模块编辑内容
  const handleShowEditor = (cell, index) => {
    // 高亮选择项目
    dispatchData({ type: 'showPanel', payload: index });
    // 编辑区域模组显示
    dispatchData({
      type: 'showEditor',
      payload: {
        id: cell?.id || new Date().getTime(), // 需要编辑的组件id
        index,
        type: cell.type,
        name: cell.text,
        moduleEditData: cell?.data || {},
      },
    });
  };

  const dropProps = { data, changeCardList, styBasket, setStyBasket, handleShowEditor };

  return (
    <div className={styles.active_Template_content}>
      <div className={styles.previewer_component}>
        <div
          id="previewer_wrap"
          className={styles.previewer_wrap}
          style={{ backgroundColor: moduleData['backgroundColor'] }}
        >
          <BasketDom index={0} {...dropProps}></BasketDom>
          {data.map((item, index) => {
            const { defaultImg } = item;
            return (
              <React.Fragment key={`${index}`}>
                <div
                  className={styles.previewer_cell}
                  onClick={() => handleShowEditor(item, index)}
                >
                  <img src={defaultImg} style={{ width: '100%' }} />
                  {/* 高亮操作区域 */}
                  <PreviewerActive
                    data={data}
                    index={index}
                    show={showPanel === index}
                    dispatchData={dispatchData}
                  ></PreviewerActive>
                </div>
                <BasketDom index={index + 1} {...dropProps}></BasketDom>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ActiveTemplateIframe;
