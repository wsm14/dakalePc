import React, { useContext } from 'react';
import { useDrop } from 'react-dnd';
import update from 'immutability-helper';
import showImg from '../showImg';
import PreviewerActive from './PreviewerActive';
import PreviewerContent from './PreviewerContent';
import search from '../Img/search.png';
import styles from './style.less';

/**
 * 放置接收组件
 * @param {Number} index 当前放置的下标
 * @param {Array} dataList 当前原始数据
 * @param {Boolean} styBasket 放置显示的状态
 * @param {Function} setStyBasket 设置放置显示的状态
 * @param {Function} changeCardList 修改数据方法
 * @param {Function} handleShowEditor 显示编辑数据模组
 * @returns
 */
const BasketDom = ({
  index,
  dataList,
  styBasket,
  setStyBasket,
  changeCardList,
  handleShowEditor,
}) => {
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: 'Card',
    drop: (dropItem) => {
      setStyBasket(false);
      const { moduleName } = dropItem;
      /**
       * 拖拽结束时，判断是否将拖拽元素放入了目标接收组件中
       *  1、如果是，则使用真正传入的 box 元素代替占位元素
       */
      // 更新 dataList 数据源
      const movefile = update(dataList, {
        $splice: [[index, 0, { moduleName }]],
      });
      console.log(movefile, 'movefile');
      changeCardList(movefile);
      handleShowEditor({ moduleName }, index);
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

  const { dataList } = moduleData;
  console.log(dataList, 'dataList');

  // 数据变化储存
  const changeCardList = (list) =>
    dispatchData({ type: 'saveModuleData', payload: { dataList: list } });

  // 显示对应的模块编辑内容
  const handleShowEditor = (cell, index) => {
    console.log('drop', cell, index);
    // 高亮选择项目
    dispatchData({ type: 'showPanel', payload: index });
  };

  const dropProps = { dataList, changeCardList, styBasket, setStyBasket, handleShowEditor };

  return (
    <div className={styles.active_Template_content}>
      <div className={styles.previewer_component}>
        <div
          id="previewer_wrap"
          className={styles.previewer_wrap}
          style={{ backgroundColor: moduleData['backgroundColor'] }}
        >
          <img src={search} style={{ width: '100%' }} />
          <BasketDom index={0} {...dropProps}></BasketDom>
          {dataList.map((item, index) => (
            <React.Fragment key={`${index}`}>
              <div className={styles.previewer_cell} onClick={() => handleShowEditor(item, index)}>
                {/* 回显dom*/}
                <PreviewerContent cell={showImg[item.moduleName]}></PreviewerContent>
                {/* 高亮操作区域 */}
                <PreviewerActive
                  data={dataList}
                  index={index}
                  show={showPanel === index}
                  dispatchData={dispatchData}
                ></PreviewerActive>
              </div>
              <BasketDom index={index + 1} {...dropProps}></BasketDom>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActiveTemplateIframe;
