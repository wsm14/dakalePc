import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Modal, Empty, Spin, Tabs } from 'antd';
import { goodsDom, commerceDom } from './CouponFreeDom';
import SearchCondition from '@/components/SearchCondition';
import './index.less';

const { TabPane } = Tabs;

/**
 * 选择权益商品（多选）
 */
const GoodsSelectModal = (props) => {
  const {
    specialGoodsList = {},
    commerceGoodsList = {},
    dispatch,
    visible,
    onSumbit,
    onClose,
    loading,
  } = props;

  const [selectItem, setSelectItem] = useState([]); // 当前选择项
  const [tabKey, setTabKey] = useState('commerceGoods'); // tab类型

  useEffect(() => {
    visible && fetchSpecialGoodsList();
  }, [tabKey, visible]);

  // 搜索参数
  const searchItems = [
    {
      label: '集团/店铺名',
      type: 'merchant',
      name: 'ownerId',
    },
    {
      label: '商品名称',
      name: 'goodsName',
    },
  ];

  const listProps = {
    specialGoods: {
      list: specialGoodsList.list,
      total: specialGoodsList.total,
      key: 'activityGoodsId',
      loading: loading.effects['baseData/fetchGetSpecialGoodsSelectList'],
    },
    commerceGoods: {
      list: commerceGoodsList.list,
      total: commerceGoodsList.total,
      key: 'activityGoodsId',
      loading: loading.effects['baseData/fetchGetPlatformCommerceGoodsSelect'],
    },
  }[tabKey];

  // 获取特惠商品
  const fetchSpecialGoodsList = (data) => {
    const payload = {
      specialGoods: {
        type: 'baseData/fetchGetSpecialGoodsSelectList',
        data: { deleteFlag: 1, selfTourFlag: 0, status: 1 },
      },
      commerceGoods: {
        type: 'baseData/fetchGetPlatformCommerceGoodsSelect',
        data: { status: 1 },
      },
    }[tabKey];
    dispatch({
      type: payload.type,
      payload: {
        ...payload.data,
        ...data,
        page: 1,
        limit: 50,
      },
    });
  };

  // 选择商品逻辑
  const handleSelect = (item) => {
    const key = listProps.key;
    if (selectItem.findIndex((ci) => ci[key] === item[key]) > -1) {
      setSelectItem((old) => old.filter((ci) => ci[key] !== item[key]));
    } else setSelectItem((old = []) => [...old, item]);
  };

  const listDom = (
    <Spin spinning={!!listProps.loading}>
      {listProps?.list?.length ? (
        <div className="share_select_list">
          {listProps?.list.map(
            (item) =>
              ({
                specialGoods: goodsDom(
                  item,
                  selectItem.map((item) => item.activityGoodsId),
                  handleSelect,
                ),
                commerceGoods: commerceDom(
                  item,
                  selectItem.map((item) => item.activityGoodsId),
                  handleSelect,
                ),
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
      title={`选择商品`}
      width={1125}
      visible={visible}
      afterClose={() => {
        setTabKey('commerceGoods');
        setSelectItem([]);
      }}
      bodyStyle={{ overflowY: 'auto', maxHeight: 500 }}
      destroyOnClose
      okButtonProps={{
        disabled: !selectItem.length,
      }}
      onOk={() => {
        onSumbit(selectItem);
      }}
      onCancel={onClose}
    >
      <SearchCondition
        colForm={{ xxl: 12 }}
        searchItems={searchItems}
        handleSearch={fetchSpecialGoodsList}
      ></SearchCondition>
      <Tabs type="card" onChange={setTabKey} style={{ overflow: 'initial' }}>
        <TabPane tab="电商品" key="commerceGoods">
          {listDom}
        </TabPane>
        <TabPane tab="特惠商品" key="specialGoods">
          {listDom}
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default connect(({ baseData, loading }) => ({
  specialGoodsList: baseData.specialGoods,
  commerceGoodsList: baseData.platformEquity,
  loading,
}))(GoodsSelectModal);
