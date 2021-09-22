import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Input, Modal, Empty, Spin, Tabs } from 'antd';
import { couponsDom, goodsDom } from './CouponFreeDom';
import './coupon.less';

const { TabPane } = Tabs;
const { Search } = Input;
/**
 * 选择优惠内容（单选）
 */
const FreeContactSelectModal = (props) => {
  const {
    couponList,
    specialGoodsList,
    merchantId,
    dispatch,
    visible,
    onClose,
    onOk,
    loading,
  } = props;

  const [selectItem, setSelectItem] = useState({}); // 当前选择项
  const [tabKey, setTabKey] = useState('coupon'); // tab类型
  const [page, setPage] = useState(1); // 页码
  const [searchValue, setSearchValue] = useState(''); // 搜索值

  useEffect(() => {
    setPage(1);
    if (visible) {
      if (tabKey === 'coupon') fetchGetBuyCouponSelect(1);
      if (tabKey === 'goods') fetchSpecialGoodsList(1);
    }
  }, [visible, page, tabKey]);

  const listProps = {
    coupon: {
      list: couponList.list,
      total: couponList.total,
      key: 'ownerCouponIdString',
      loading: loading.effects['baseData/fetchGetBuyCouponSelect'],
    },
    goods: {
      list: specialGoodsList.list,
      total: specialGoodsList.total,
      key: 'specialGoodsId',
      loading: loading.effects['baseData/fetchGetSpecialGoodsSelect'],
    },
  }[tabKey];

  // 获取有价券列表
  const fetchGetBuyCouponSelect = (num) => {
    dispatch({
      type: 'baseData/fetchGetBuyCouponSelect',
      payload: {
        merchantId,
        couponName: searchValue,
        couponType: 'reduce',
        buyFlag: 1, // 有价券
        page: num || page,
        limit: 999,
      },
    });
  };

  // 获取特惠活动
  const fetchSpecialGoodsList = (num) => {
    dispatch({
      type: 'baseData/fetchGetSpecialGoodsSelect',
      payload: {
        merchantId,
        goodsName: searchValue,
        goodsStatus: 1,
        page: num || page,
        limit: 999,
      },
    });
  };

  const listDom = (
    <Spin spinning={listProps.loading}>
      {listProps.list.length ? (
        <div className="share_select_list">
          {listProps.list.map(
            (item) =>
              ({
                coupon: couponsDom(item, selectItem.ownerCouponIdString, setSelectItem, 'valuable'),
                goods: goodsDom(item, selectItem.specialGoodsId, setSelectItem),
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
      title={`选择优惠内容（单选）`}
      width={780}
      visible={visible}
      afterClose={() => {
        setPage(1);
        setTabKey('coupon');
      }}
      maskStyle={{ background: 'none' }}
      bodyStyle={{ overflowY: 'auto', maxHeight: 500 }}
      destroyOnClose
      okButtonProps={{
        disabled: !selectItem[listProps.key],
      }}
      onOk={() => {
        onOk({ ...selectItem, promotionType: tabKey });
        onClose();
      }}
      onCancel={onClose}
    >
      <Tabs
        type="card"
        onChange={setTabKey}
        style={{ overflow: 'initial' }}
        tabBarExtraContent={
          <Search placeholder="请输入名称" enterButton allowClear onSearch={setSearchValue} />
        }
      >
        <TabPane tab="有价券" key="coupon">
          {listDom}
        </TabPane>
        <TabPane tab="特惠商品" key="goods">
          {listDom}
        </TabPane>
      </Tabs>
      {/* <div style={{ textAlign: 'right', marginTop: 10 }}>
        <Pagination
          current={page}
          size="small"
          pageSize={9}
          total={listProps.total}
          showTotal={() => `共 ${listProps.total} 项`}
          showQuickJumper
          showSizeChanger={false}
          onChange={(val) => setPage(val)}
        />
      </div> */}
    </Modal>
  );
};

export default connect(({ baseData, loading }) => ({
  couponList: baseData.buyCoupon,
  specialGoodsList: baseData.specialGoods,
  loading,
}))(FreeContactSelectModal);
