import React, { useState, useEffect } from 'react';
import { Modal, Tabs } from 'antd';
import SearchCondition from '@/components/SearchCondition';
import ReduceCoupon from './ReduceCoupon';
import SpecialGoods from './SpecialGoods';
import CommerceGoods from './CommerceGoods';
import PlatformCoupon from './PlatformCoupon';
import FreeCoupon from './FreeReduceCoupon';
import ActiveReduceCoupon from './ActiveReduceCoupon';
import './index.less';

const { TabPane } = Tabs;
/**
 * 商品选择弹窗
 * @param {Function} disabled 不可选择规则 (row) => Boolean
 * @param {String} selectType 选择的类型 单选多选 默认多选 checkbox | radio
 * @param {String} idKey 外部数据唯一键的key值
 * @param {Array} goodsValues 已选值 商品源数据
 * @param {Array} showTag 显示的类型 可选
 * [
 * "freeReduceCoupon",
 * "platformCoupon",
 * "reduceCoupon",
 * "specialGoods",
 * "commerceGoods",
 * "activeReduceCoupon"
 * ]
 * @param {Object} searchParams 默认搜索值
 * @param {Boolean} closeSumbit 确认后是否自动关闭 默认关闭
 * @param {Boolean} hiddenSearch 隐藏搜索项目
 * @param {Function} onSumbit 确认回调 ({ keys: [], list: [] }) => {}
 * @param {Function} onClose 关闭事件
 * @param {Function} rowSelection 表格点击回调 ({ setSelectItem: Function(selectedRowKeys, selectedRows) }) => ({})
 * @returns
 */
const GoodsSelectModal = (props) => {
  const {
    disabled,
    visible = false,
    idKey = 'goodsId',
    goodsValues = [],
    searchParams = {},
    selectType = 'checkbox', // checkbox | radio
    hiddenSearch = false,
    showTag = null,
    onSumbit,
    onClose,
    closeSumbit = true,
    rowSelection,
    loading,
  } = props;

  const [tabKey, setTabKey] = useState('reduceCoupon'); // tab类型
  const [selectItem, setSelectItem] = useState({ keys: [], list: [] }); // 当前选择项
  const [searchValue, setSearchValue] = useState({}); // 搜索值
  const [ownerType, setOwnerType] = useState(undefined); // 商家类型

  useEffect(() => {
    if (visible) {
      const showTab = tabPaneList.filter((i) => (showTag || allTag).includes(i.key));
      showTab.length && setTabKey(showTab[0].key);
      const newData = goodsValues.filter((i) => {
        if (typeof i === 'object') {
          return !!Object.keys(i).length;
        } else return i;
      });
      // 数据还原
      if (newData && newData.length) {
        setSelectItem({
          keys: newData.map((i) => i.goodsId || i[idKey] || i),
          list: newData,
        });
      }
      // 默认搜索值
      if (Object.keys(searchParams).length) setSearchValue({ ...searchParams, page: 1 });
    }
  }, [visible]);

  // 不包括 活动模版 相关接口 activeReduceCoupon
  const allTag = [
    'freeReduceCoupon',
    'platformCoupon',
    'reduceCoupon',
    'specialGoods',
    'commerceGoods',
  ];

  // 点击选择
  const handleSelectItem = (newKeys = [], newlist = []) => {
    console.log(newKeys, newlist);
    setSelectItem((old) => {
      const obj = {};
      const { list = [] } = old;
      const allList = [...list, ...newlist]; // 获取新老所有数据
      const checkList = allList
        .filter((i) => i && newKeys.includes(i.goodsId || i[idKey])) // 去除id不存在数据（取消选择数据）
        .reduce((item, next) => {
          next && obj[next.goodsId || next[idKey]]
            ? ''
            : next && (obj[next.goodsId || next[idKey]] = true && item.push(next));
          return item;
        }, []); // 去重
      return { keys: newKeys, list: checkList };
    });
  };

  const propsComponents = {
    visible,
    disabled,
    selectItem,
    selectType,
    searchValue,
    rowSelection,
    loadingProps: loading,
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
    {
      tab: '有价券', // 活动模版
      key: 'activeReduceCoupon',
      content: <ActiveReduceCoupon {...propsComponents}></ActiveReduceCoupon>,
    },
  ];

  // 搜索参数
  const searchItems = [
    {
      label: '集团/店铺名',
      name: 'id',
      type: 'merchant',
      required: ['reduceCoupon', 'activeReduceCoupon'].includes(tabKey), // 有价券
      show:
        ['specialGoods', 'reduceCoupon', 'activeReduceCoupon'].includes(tabKey) && !searchParams.id,
      onChange: (val, op) => setOwnerType(op.option.option.merchantType),
    },
    {
      label: '商品名称',
      name: 'goodsName', // 有价券 特惠商品 电商品 平台券 活动模版有价券
      show: [
        'reduceCoupon',
        'specialGoods',
        'commerceGoods',
        'platformCoupon',
        'activeReduceCoupon',
      ].includes(tabKey),
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
      width={1085}
      visible={visible}
      afterClose={() => {
        setSearchValue({});
        setSelectItem({ keys: [] });
      }}
      // maskStyle={{ background: 'none' }}
      bodyStyle={{ paddingBottom: 0 }}
      destroyOnClose
      okText={`确定（已选${selectItem.keys.length}项）`}
      okButtonProps={{
        loading,
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
          handleSearch={(val) => {
            setSearchValue({ ...searchParams, ...val, ownerType, page: 1 });
          }}
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
