import React, { useContext } from 'react';
import { useDrop } from 'react-dnd';
import update from 'immutability-helper';
import PreviewerActive from './PreviewerActive';
import PreviewerContent from './PreviewerContent';
import ShareShowDom from '../Editor/Share/showDom';
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
      const { icon, editorDom, type, ...other } = dropItem;
      /**
       * 拖拽结束时，判断是否将拖拽元素放入了目标接收组件中
       *  1、如果是，则使用真正传入的 box 元素代替占位元素
       */
      // 更新 dataList 数据源
      const movefile = update(dataList, {
        $splice: [[index, 0, other]],
      });
      changeCardList(movefile);
      handleShowEditor(other, index);
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
  const { dispatchData, showPanel, moduleData, showEditor, info = {} } = useContext(context);
  const { type } = info;

  const { dataList } = moduleData;

  // 数据变化储存
  const changeCardList = (list) =>
    dispatchData({ type: 'saveModuleData', payload: { dataList: list } });

  // 显示对应的模块编辑内容
  const handleShowEditor = (cell = {}, index) => {
    console.log('drop', cell, index);
    const { editorDom, dom, defaultImg, icon, ...ohter } = cell;
    // 高亮选择项目
    dispatchData({ type: 'showPanel', payload: index });
    // 编辑区域模组显示
    dispatchData({
      type: 'showEditor',
      payload: {
        ...ohter,
        id: cell?.id || new Date().getTime(), // 需要编辑的组件id
        index,
        data: cell?.data || cell?.defaultData || null,
      },
    });
  };

  const dropProps = { dataList, changeCardList, styBasket, setStyBasket, handleShowEditor };

  const showDom = dataList.map((item, index) => (
    <React.Fragment key={`${index}`}>
      <div className={styles.previewer_cell} onClick={() => handleShowEditor(item, index)}>
        {/* 回显dom*/}
        <PreviewerContent cell={item}></PreviewerContent>
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
  ));

  return (
    <div className={styles.active_Template_content}>
      <div className={styles.previewer_component}>
        {moduleData['share'] && <ShareShowDom data={moduleData['share']}></ShareShowDom>}
        <div
          id="previewer_wrap"
          className={`${styles.previewer_wrap} ${type === 'globalModal' && styles.gloadModal}`}
          style={{ backgroundColor: moduleData['backgroundColor'] }}
        >
          <BasketDom index={0} {...dropProps}></BasketDom>
          {type === 'globalModal' &&
          (showEditor.editorType === 'globalModalPlatformCoupon' ||
            dataList[0]?.editorType === 'globalModalPlatformCoupon')
            ? (() => {
                const {
                  box_head = 'https://resource-new.dakale.net/admin/image/globalModal/globalModal_coupon_head.png',
                  box_bag1 = '#fffced',
                  box_bag2 = '#ffebd6',
                  box_title = 'https://resource-new.dakale.net/admin/image/globalModal/coupon_title.png',
                  title_width = '540',
                  coupon_get = 'https://resource-new.dakale.net/admin/image/globalModal/coupon_btn.png',
                  btn_width = '400',
                  btn_height = '80',
                } = dataList[0] || {};
                return (
                  <div
                    className={styles.globalModal_coupon}
                    style={{
                      background: `linear-gradient(180deg, ${box_bag1} 0%, ${box_bag2} 100%)`,
                    }}
                  >
                    <div className={styles.globalModal_coupon_head}>
                      <img src={box_head} style={{ width: 270, height: 35 }} />
                    </div>
                    <div className={styles.globalModal_coupon_title}>
                      <img src={box_title} style={{ width: Number(title_width) / 2 }} />
                    </div>
                    <div className={styles.globalModal_coupon_group}>{showDom}</div>
                    <div className={styles.globalModal_coupon_footer}>
                      <img
                        src={coupon_get}
                        style={{ width: Number(btn_width) / 2, height: Number(btn_height) / 2 }}
                      />
                    </div>
                  </div>
                );
              })()
            : showDom}
          {type === 'globalModal' && <div className={styles.model_close}></div>}
        </div>
      </div>
    </div>
  );
};

export default ActiveTemplateIframe;
