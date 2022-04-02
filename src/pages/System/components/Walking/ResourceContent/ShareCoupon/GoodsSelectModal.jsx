import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Modal, Empty, Spin, Tabs } from 'antd';
import { goodsDom, commerceDom } from './CouponFreeDom';
import { PLATFORM_TICKET_SCENE } from '@/common/constant';
import SearchCondition from '@/components/SearchCondition';
import './index.less';

const { TabPane } = Tabs;
/**
 * 选择平台券/权益商品/权益券（多选）
 */
const GoodsSelectModal = (props) => {
  const {
    specialGoodsList = {},
    commerceGoodsList = {},
    form,
    dispatch,
    visible,
    onClose,
    loading,
    typeList = 'mixedList',
  } = props;

  const [selectItem, setSelectItem] = useState([]); // 当前选择项
  const [tabKey, setTabKey] = useState(''); // tab类型

  useEffect(() => {
    if (visible) {
      setTabKey(typeList == 'mixedList' ? 'specialGoods' : typeList);
      setSelectItem(form.getFieldValue(typeList) || []);
    }
  }, [visible]);

  useEffect(() => {
    visible && tabKey && fetchSpecialGoodsList();
  }, [tabKey]);

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
    selfTourGoods: {
      list: specialGoodsList.list,
      total: specialGoodsList.total,
      key: 'activityGoodsId',
      loading: loading.effects['baseData/fetchGetSpecialGoodsSelectList'],
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
      selfTourGoods: {
        type: 'baseData/fetchGetSpecialGoodsSelectList',
        data: { deleteFlag: 1, selfTourFlag: 1, status: 1 },
      },
    }[tabKey];
    dispatch({
      type: payload.type,
      payload: {
        ...payload.data,
        ...data,
        page: 1,
        limit: 100,
      },
    });
  };

  // 选择商品逻辑
  const handleSelect = (item) => {
    const key = listProps.key;
    if (selectItem.findIndex((ci) => ci[key] === item[key]) > -1) {
      setSelectItem(selectItem.filter((ci) => ci[key] !== item[key]));
    } else setSelectItem([...selectItem, item]);
  };

  const listDom = (
    <Spin spinning={!!listProps?.loading}>
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
                selfTourGoods: goodsDom(
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
      afterClose={() => (setTabKey('specialGoods'), setSelectItem([]))}
      bodyStyle={{ overflowY: 'auto', maxHeight: 500 }}
      destroyOnClose
      okButtonProps={{
        disabled: !selectItem.length,
      }}
      onOk={() => {
        form.setFieldsValue({
          // [typeList]: (form.getFieldValue(typeList) || []).concat(selectItem),
          [typeList]: selectItem,
        });
        onClose();
      }}
      onCancel={onClose}
    >
      <SearchCondition
        searchItems={searchItems}
        handleSearch={fetchSpecialGoodsList}
      ></SearchCondition>
      <Tabs type="card" activeKey={tabKey} onChange={setTabKey} style={{ overflow: 'initial' }}>
        <TabPane
          tab="特惠商品"
          key="specialGoods"
          disabled={['commerceGoods', 'selfTourGoods'].includes(typeList)}
        >
          {listDom}
        </TabPane>
        <TabPane
          tab="电商品"
          key="commerceGoods"
          disabled={['specialGoods', 'selfTourGoods'].includes(typeList)}
        >
          {listDom}
        </TabPane>
        <TabPane
          tab="自我游"
          key="selfTourGoods"
          disabled={['specialGoods', 'commerceGoods'].includes(typeList)}
        >
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
