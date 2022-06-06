import React, { useState } from 'react';
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
    visible = true,
    selectType = 'checkbox', // checkbox | radio
    hiddenTag = [],
    onOk,
    onClose,
  } = props;

  const [selectItem, setSelectItem] = useState({ keys: [] }); // 当前选择项
  const [searchValue, setSearchValue] = useState({}); // 搜索值

  // 点击选择
  const handleSelectItem = (newKeys = [], newlist = []) => {
    setSelectItem({ keys: newKeys, list: newlist });
  };

  // 搜索参数
  const searchItems = [
    {
      label: '集团/店铺名',
      name: 'id',
      type: 'merchant',
      required: true,
    },
    {
      label: '商品名称',
      name: 'goodsName',
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
      show: !hiddenTag.includes('reduceCoupon'),
      content: <ReduceCoupon {...propsComponents}></ReduceCoupon>,
    },
    {
      tab: '特惠商品',
      key: 'specialGoods',
      show: !hiddenTag.includes('specialGoods'),
      content: <SpecialGoods {...propsComponents}></SpecialGoods>,
    },
    {
      tab: '电商品',
      key: 'commerceGoods',
      show: !hiddenTag.includes('commerceGoods'),
      content: <CommerceGoods {...propsComponents}></CommerceGoods>,
    },
  ];

  return (
    <Modal
      title={`选择内容`}
      width={900}
      visible={visible}
      afterClose={() => {
        setSelectItem({});
      }}
      // maskStyle={{ background: 'none' }}
      bodyStyle={{ paddingBottom: 0 }}
      destroyOnClose
      okText={`确定（已选${selectItem.keys.length}项）`}
      okButtonProps={{
        disabled: !selectItem.keys.length,
      }}
      onOk={() => {
        onOk(selectItem);
        onClose();
      }}
      onCancel={onClose}
    >
      <SearchCondition
        colForm={{ xxl: 12 }}
        searchItems={searchItems}
        handleSearch={setSearchValue}
      ></SearchCondition>
      <Tabs destroyInactiveTabPane type="card" style={{ overflow: 'initial' }}>
        {tabPaneList.map(
          (pane) =>
            pane.show && (
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
