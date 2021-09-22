import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Input, Modal, Empty, Spin, Tabs } from 'antd';
import { goodsDom } from './CouponFreeDom';
import SearchCondition from '@/components/SearchCondition';
import '../index.less';

const { TabPane } = Tabs;
const { Search } = Input;
/**
 * 选择特惠商品（多选）
 */
const GoodsSelectModal = (props) => {
  const { specialGoodsList = {}, form, dispatch, visible, onClose, loading } = props;

  const [selectItem, setSelectItem] = useState([]); // 当前选择项
  const [tabKey, setTabKey] = useState('goods'); // tab类型

  useEffect(() => {
    if (visible) {
      if (tabKey === 'goods') {
        setSelectItem(form.getFieldValue('list') || []);
      }
    }
  }, [visible]);

  // 搜索参数
  const searchItems = [
    {
      label: '选择店铺',
      name: 'ownerId',
      type: 'merchant',
      col: false,
    },
  ];

  const listProps = {
    goods: {
      list: specialGoodsList.list,
      total: specialGoodsList.total,
      key: 'specialGoodsId',
    },
  }[tabKey];

  // 获取特惠活动
  const fetchSpecialGoodsList = (data) => {
    if (!data.ownerId) return;
    dispatch({
      type: 'activeTemplate/fetchSpecialGoodsSelect',
      payload: {
        ...data,
        goodsName: searchValue,
        page: 1,
        limit: 999,
      },
    });
  };

  // 选择商品逻辑
  const handleSelect = (item) => {
    if (selectItem.length >= 50) return;
    const key = 'specialGoodsId';
    if (selectItem.findIndex((ci) => ci[key] === item[key]) > -1) {
      setSelectItem(selectItem.filter((ci) => ci[key] !== item[key]));
    } else setSelectItem([...selectItem, item]);
  };

  const listDom = (
    <Spin spinning={!!loading.effects['activeTemplate/fetchSpecialGoodsSelect']}>
      {listProps?.list?.length ? (
        <div className="share_select_list">
          {listProps?.list.map(
            (item) =>
              ({
                goods: goodsDom(item, selectItem, handleSelect),
              }[tabKey]),
          )}
        </div>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </Spin>
  );

  return (
    <Modal
      title={`选择特惠商品（已选 ${selectItem.length}）`}
      width={1125}
      visible={visible}
      afterClose={() => setTabKey('goods')}
      bodyStyle={{ overflowY: 'auto', maxHeight: 500 }}
      destroyOnClose
      okButtonProps={{
        disabled: !selectItem.length,
      }}
      onOk={() => {
        form.setFieldsValue({ list: selectItem });
        onClose();
      }}
      onCancel={onClose}
    >
      <SearchCondition
        searchItems={searchItems}
        handleSearch={fetchSpecialGoodsList}
      ></SearchCondition>
      <Tabs
        type="card"
        onChange={setTabKey}
        style={{ overflow: 'initial' }}
        tabBarExtraContent={
          <Search placeholder="请输入名称" enterButton allowClear onSearch={setSearchValue} />
        }
      >
        <TabPane tab="特惠商品" key="goods">
          {listDom}
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default connect(({ activeTemplate, loading }) => ({
  specialGoodsList: activeTemplate.specialGoods,
  loading,
}))(GoodsSelectModal);
