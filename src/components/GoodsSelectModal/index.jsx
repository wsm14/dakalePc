import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Modal, Tabs } from 'antd';
import SearchCondition from '@/components/SearchCondition';
import ReduceCoupon from './ReduceCoupon';
import SpecialGoods from './SpecialGoods';
import CommerceGoods from './CommerceGoods';

const { TabPane } = Tabs;
/**
 * 商品选择弹窗
 * @param {String} selectType checkbox | radio
 * @returns
 */
const GoodsSelectModal = (props) => {
  const {
    couponList,
    specialGoodsList,
    merchantId,
    dispatch,
    visible,
    onClose,
    onOk,
    loading,
    selectType = 'checkbox', // checkbox | radio
    typeGoods = 'specialGoods',
  } = props;

  const [selectItem, setSelectItem] = useState({ keys: [] }); // 当前选择项
  const [tabKey, setTabKey] = useState('reduceCoupon'); // tab类型
  const [searchValue, setSearchValue] = useState(''); // 搜索值

  useEffect(() => {}, [visible, tabKey, searchValue]);

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

  // 获取特惠活动
  const fetchSelectGoodsList = (data) => {
    if (!data?.id) return;
    const payload = {
      reduceCoupon: {
        type: 'baseData/fetchGetBuyCouponSelect',
        data: {
          merchantId: data.id,
          couponName: data.goodsName,
          goodsStatus: 1,
          couponType: 'reduce',
          buyFlag: 1, // 有价券
        },
      },
      specialGoods: {
        type: 'baseData/fetchGetSpecialGoodsSelect',
        data: { goodsStatus: 1, merchantId: data.id },
      },
      rightGoods: {
        type: 'baseData/fetchGetPlatformEquitySelect',
        data: { buyFlag: 1, relateId: data.id },
      },
    }[typeGoods];
    dispatch({
      type: payload.type,
      payload: {
        ...payload.data,
        page: 1,
        limit: 999,
      },
    });
  };

  // 点击选择
  const handleSelectItem = (keys = [], list = []) => {
    setSelectItem({ keys, list });
  };

  const propsComponents = {
    selectItem,
    selectType,
    handleSelectItem,
  };

  return (
    <Modal
      title={`选择内容`}
      width={900}
      visible={false}
      afterClose={() => {
        setTabKey('reduceCoupon');
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
        onOk({ ...selectItem, promotionType: tabKey });
        onClose();
      }}
      onCancel={onClose}
    >
      <SearchCondition
        colForm={{ xxl: 12 }}
        searchItems={searchItems}
        handleSearch={fetchSelectGoodsList}
      ></SearchCondition>
      <Tabs type="card" onChange={setTabKey} style={{ overflow: 'initial' }}>
        <TabPane tab="有价券" key="reduceCoupon">
          <ReduceCoupon {...propsComponents}></ReduceCoupon>
        </TabPane>
        <TabPane tab="特惠商品" key="specialGoods">
          <SpecialGoods {...propsComponents}></SpecialGoods>
        </TabPane>
        <TabPane tab="电商品" key="commerceGoods">
          <CommerceGoods {...propsComponents}></CommerceGoods>
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default connect(({ baseData, loading }) => ({
  couponList: baseData.buyCoupon,
  specialGoodsList: baseData.specialGoods,
  loading,
}))(GoodsSelectModal);
