import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Input, Modal, Empty, Spin, Tabs } from 'antd';
import { couponsDom, goodsDom } from './CouponFreeDom';
import SearchCondition from '@/components/SearchCondition';

import './coupon.less';

const { TabPane } = Tabs;
const { Search } = Input;
/**
 * 选择优惠内容（单选）
 */
const FreeContactSelectModal = (props) => {
  const { platformEquityList, merchantId, dispatch, visible, onClose, onOk, loading, typeGoods } =
    props;

  const [selectItem, setSelectItem] = useState({}); // 当前选择项
  // const [tabKey, setTabKey] = useState('goods'); // tab类型
  const [page, setPage] = useState(1); // 页码

  useEffect(() => {
    setPage(1);
    if (visible) {
      fetchPlatformEquityList(1);
    }
  }, [visible, page]);

  const listProps = {
    list: platformEquityList.list,
    total: platformEquityList.total,
    key: 'specialGoodsId',
    loading: loading.effects['baseData/fetchGetPlatformEquitySelect'],
  };

  // 获取特惠活动
  const fetchPlatformEquityList = (num) => {
    dispatch({
      type: 'baseData/fetchGetPlatformEquitySelect',
      payload: {
        ...num,
        goodsStatus: 1,
        buyFlag: '0',
        page: 1,
        limit: 999,
      },
    });
  };

  const listDom = (
    <Spin spinning={listProps.loading}>
      {listProps.list.length ? (
        <div className="share_select_list">
          {listProps.list.map((item) =>
            goodsDom({ typeGoods, ...item }, selectItem.specialGoodsId, setSelectItem),
          )}
        </div>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </Spin>
  );

  const searchItems = [
    {
      label: '商品名称',
      name: 'goodsName',
    },
    {
      label: '集团/店铺名',
      name: 'relateId',
      type: 'merchant',
    },
  ];

  return (
    <Modal
      title={`选择权益商品（单选）`}
      width={780}
      visible={visible}
      afterClose={() => {
        setPage(1);
      }}
      maskStyle={{ background: 'none' }}
      bodyStyle={{ overflowY: 'auto', maxHeight: 500 }}
      destroyOnClose
      okButtonProps={{
        disabled: !selectItem[listProps.key],
      }}
      onOk={() => {
        onOk({ ...selectItem, promotionType: 'goods' });
        onClose();
      }}
      onCancel={onClose}
    >
      <SearchCondition
        searchItems={searchItems}
        handleSearch={fetchPlatformEquityList}
      ></SearchCondition>
      <Tabs type="card" style={{ overflow: 'initial' }}>
        <TabPane tab="特惠商品" key="goods">
          {listDom}
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default connect(({ baseData, loading }) => ({
  couponList: baseData.buyCoupon,
  platformEquityList: baseData.platformEquity,
  loading,
}))(FreeContactSelectModal);
