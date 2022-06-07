import React, { useState, useEffect } from 'react';
import { Modal, Tabs } from 'antd';
import SearchCondition from '@/components/SearchCondition';
import ReduceCoupon from './ReduceCoupon';
import SpecialGoods from './SpecialGoods';
import CommerceGoods from './CommerceGoods';

const { TabPane } = Tabs;
/**
 * 商品选择弹窗
 * @param {String} selectType 选择的类型 单选多选 默认多选 checkbox | radio
 * @param {Array} hiddenTag 隐藏的类型 可选 ["reduceCoupon","specialGoods","commerceGoods"]
 * @returns
 */
const GoodsSelectModal = (props) => {
  const {
    visible = false,
    selectType = 'checkbox', // checkbox | radio
    hiddenTag = [],
    onSumbit,
    onClose,
  } = props;

  const [tabKey, setTabKey] = useState('reduceCoupon'); // tab类型
  const [selectItem, setSelectItem] = useState({ keys: [] }); // 当前选择项
  const [searchValue, setSearchValue] = useState({}); // 搜索值

  useEffect(() => {
    if (visible) {
      const showTab = tabPaneList.filter((i) => !hiddenTag.includes(i.key));
      showTab.length && setTabKey(showTab[0].key);
    }
  }, [visible]);

  // 点击选择
  const handleSelectItem = (newKeys = [], newlist = []) => {
    setSelectItem((old) => {
      const obj = {};
      const { list = [] } = old;
      const allList = [...list, ...newlist];
      const checkList = allList
        .filter((i) => i && newKeys.includes(i.goodsId))
        .reduce((item, next) => {
          next && obj[next.goodsId] ? '' : next && (obj[next.goodsId] = true && item.push(next));
          return item;
        }, []);
      return { keys: newKeys, list: checkList };
    });
  };

  // 搜索参数
  const searchItems = [
    {
      label: '集团/店铺名',
      name: 'id',
      type: 'merchant',
      required: true,
      show: tabKey === 'reduceCoupon',
    },
    {
      label: '商品名称',
      name: 'goodsName',
    },
    {
      label: '商品ID',
      name: 'goodsId',
      show: tabKey !== 'reduceCoupon',
    },
  ];

  const propsComponents = {
    visible,
    selectItem,
    selectType,
    searchValue,
    handleSelectItem,
  };

  const tabPaneList = [
    {
      tab: '有价券',
      key: 'reduceCoupon',
      content: <ReduceCoupon {...propsComponents}></ReduceCoupon>,
    },
    {
      tab: '特惠商品',
      key: 'specialGoods',
      content: <SpecialGoods {...propsComponents}></SpecialGoods>,
    },
    {
      tab: '电商品',
      key: 'commerceGoods',
      content: <CommerceGoods {...propsComponents}></CommerceGoods>,
    },
  ];

  return (
    <Modal
      title={`选择内容`}
      width={900}
      visible={visible}
      afterClose={() => {
        setSelectItem({ keys: [] });
      }}
      // maskStyle={{ background: 'none' }}
      bodyStyle={{ paddingBottom: 0 }}
      destroyOnClose
      okText={`确定（已选${selectItem.keys.length}项）`}
      okButtonProps={{
        disabled: !selectItem.keys.length,
      }}
      onOk={() => {
        console.log(selectItem);
        onSumbit && onSumbit(selectItem);
        onClose();
      }}
      onCancel={onClose}
    >
      <SearchCondition
        colForm={{ xxl: 12 }}
        searchItems={searchItems}
        handleSearch={setSearchValue}
      ></SearchCondition>
      <Tabs destroyInactiveTabPane onChange={setTabKey} type="card" style={{ overflow: 'initial' }}>
        {tabPaneList.map(
          (pane) =>
            !hiddenTag.includes(pane.key) && (
              <TabPane tab={pane.tab} key={pane.key}>
                {pane.content}
              </TabPane>
            ),
        )}
      </Tabs>
    </Modal>
  );
};

export default GoodsSelectModal;
