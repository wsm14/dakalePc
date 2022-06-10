import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Modal, Empty, Spin, Tabs } from 'antd';
import { goodsDom } from './CouponFreeDom';
import SearchCondition from '@/components/SearchCondition';
import '../index.less';

const { TabPane } = Tabs;
/**
 * 选择电商商品（多选）
 */
const GoodsSelectModal = (props) => {
  const { commerceGoods = {}, form, dispatch, visible, onClose, loading } = props;

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
      name: 'relateId',
      type: 'merchant',
      required: true,
      col: false,
    },
    {
      label: '商品名称',
      name: 'goodsName',
      col: false,
    },
  ];

  const listProps = {
    goods: {
      list: commerceGoods.list,
      total: commerceGoods.total,
      key: 'specialGoodsId',
    },
  }[tabKey];

  // 获取电商商品
  const fetchCommerceGoodsSelect = (data) => {
    if (!data.relateId) return;
    dispatch({
      type: 'activeTemplate/fetchCommerceGoodsSelect',
      payload: {
        ...data,
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
    <Spin spinning={!!loading.effects['activeTemplate/fetchCommerceGoodsSelect']}>
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
      title={`选择电商商品（已选 ${selectItem.length}）`}
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
        handleSearch={fetchCommerceGoodsSelect}
      ></SearchCondition>
      <Tabs type="card" onChange={setTabKey} style={{ overflow: 'initial' }}>
        <TabPane tab="电商商品" key="goods">
          {listDom}
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default connect(({ activeTemplate, loading }) => ({
  commerceGoods: activeTemplate.commerceGoods,
  loading,
}))(GoodsSelectModal);
