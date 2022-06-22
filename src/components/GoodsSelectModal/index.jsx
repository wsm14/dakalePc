import React, { useState, useEffect } from 'react';
import { Modal, Tabs } from 'antd';
import SearchCondition from '@/components/SearchCondition';
import ReduceCoupon from './ReduceCoupon';
import SpecialGoods from './SpecialGoods';
import CommerceGoods from './CommerceGoods';
import PlatformCoupon from './PlatformCoupon';
import FreeCoupon from './FreeReduceCoupon';
import './index.less';

const { TabPane } = Tabs;
/**
 * 商品选择弹窗
 * @param {Function} disabled 不可选择规则 (row) => Boolean
 * @param {String} selectType 选择的类型 单选多选 默认多选 checkbox | radio
 * @param {Array} goodsValues 已选值 商品源数据
 * @param {Array} showTag 显示的类型 可选
 * ["freeReduceCoupon","platformCoupon", "reduceCoupon","specialGoods","commerceGoods"]
 * @param {Object} searchParams 默认搜索值
 * @param {Boolean} closeSumbit 确认后是否自动关闭 默认关闭
 * @param {Boolean} hiddenSearch 隐藏搜索项目
 * @param {Function} onSumbit 确认回调 ({ keys: [], list: [] }) => {}
 * @returns
 */
const GoodsSelectModal = (props) => {
  const {
    disabled,
    visible = false,
    goodsValues = [],
    searchParams = {},
    selectType = 'checkbox', // checkbox | radio
    hiddenSearch = false,
    showTag = null,
    onSumbit,
    onClose,
    closeSumbit = true,
  } = props;

  const [tabKey, setTabKey] = useState('reduceCoupon'); // tab类型
  const [selectItem, setSelectItem] = useState({ keys: [] }); // 当前选择项
  const [searchValue, setSearchValue] = useState({}); // 搜索值

  useEffect(() => {
    if (visible) {
      const showTab = tabPaneList.filter((i) => (showTag || allTag).includes(i.key));
      showTab.length && setTabKey(showTab[0].key);
      const newData = goodsValues.filter((i) => i);
      // 数据还原
      if (newData && newData.length) {
        setSelectItem({ keys: newData.map((i) => i.goodsId || i), list: newData });
      }
      // 默认搜索值
      if (Object.keys(searchParams).length) setSearchValue(searchParams);
    }
  }, [visible]);

  const allTag = [
    'freeReduceCoupon',
    'platformCoupon',
    'reduceCoupon',
    'specialGoods',
    'commerceGoods',
  ];

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

  const propsComponents = {
    visible,
    disabled,
    selectItem,
    selectType,
    searchValue,
    handleSelectItem,
  };

  const tabPaneList = [
    {
      tab: '免费券',
      key: 'freeReduceCoupon',
      content: <FreeCoupon {...propsComponents}></FreeCoupon>,
    },
    {
      tab: '有价券',
      key: 'reduceCoupon',
      content: <ReduceCoupon {...propsComponents}></ReduceCoupon>,
    },
    {
      tab: '平台券',
      key: 'platformCoupon',
      content: <PlatformCoupon {...propsComponents}></PlatformCoupon>,
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

  // 搜索参数
  const searchItems = [
    {
      label: '集团/店铺名',
      name: 'id',
      type: 'merchant',
      required: true, // 有价券
      show: ['reduceCoupon'].includes(tabKey) && !searchParams.id,
    },
    {
      label: '商品名称',
      name: 'goodsName', // 有价券 特惠商品 电商品 平台券
      show: ['platformCoupon', 'reduceCoupon', 'specialGoods', 'commerceGoods'].includes(tabKey),
    },
    {
      label: '商品ID',
      name: 'goodsId', // 特惠商品 电商品
      show: ['specialGoods', 'commerceGoods'].includes(tabKey),
    },
    {
      label: '券编号',
      name: 'platformCouponId', // 平台券
      show: ['platformCoupon'].includes(tabKey),
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
        closeSumbit && onClose();
      }}
      onCancel={onClose}
    >
      {searchItems.filter((i) => i.show).length > 0 && !hiddenSearch && (
        <SearchCondition
          searchItems={searchItems}
          handleSearch={(val) => setSearchValue({ ...searchParams, ...val })}
        ></SearchCondition>
      )}
      <Tabs destroyInactiveTabPane onChange={setTabKey} type="card" style={{ overflow: 'initial' }}>
        {tabPaneList.map(
          (pane) =>
            (showTag || allTag).includes(pane.key) && (
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
