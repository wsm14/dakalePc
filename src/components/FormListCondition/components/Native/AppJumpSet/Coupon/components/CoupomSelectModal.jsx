import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Input, Modal, Empty, Spin, Tabs } from 'antd';
import { couponsDom } from './CouponFreeDom';
import '../../SpecialGoods/index.less';

const { TabPane } = Tabs;
const { Search } = Input;

/**
 * 选择特惠商品（单选）
 * @param {String} merchantId 商家id
 */
const GoodsSelectModal = (props) => {
  const { couponList = {}, merchantId, dispatch, visible, onClose, onOk, loading } = props;

  const [selectItem, setSelectItem] = useState({}); // 当前选择项
  const [tabKey, setTabKey] = useState('coupon'); // tab类型
  const [searchValue, setSearchValue] = useState(''); // 搜索值

  useEffect(() => {
    if (visible) {
      if (tabKey === 'coupon') fetchGetBuyCouponSelect();
    }
  }, [visible, tabKey, searchValue]);

  const listProps = {
    coupon: {
      list: couponList.list,
      total: couponList.total,
      key: 'ownerCouponIdString',
      loading: loading.effects['baseData/fetchGetBuyCouponSelect'],
    },
  }[tabKey];

  // 获取有价券列表
  const fetchGetBuyCouponSelect = () => {
    dispatch({
      type: 'baseData/fetchGetBuyCouponSelect',
      payload: {
        merchantId,
        couponName: searchValue,
        couponType: 'reduce',
        buyFlag: 1, // 有价券
        page: 1,
        limit: 999,
      },
    });
  };

  const listDom = (
    <Spin spinning={listProps.loading}>
      {listProps?.list?.length ? (
        <div className="share_select_list">
          {listProps?.list.map(
            (item) =>
              item &&
              {
                coupon: couponsDom(item, selectItem.ownerCouponIdString, setSelectItem, 'valuable'),
              }[tabKey],
          )}
        </div>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </Spin>
  );

  return (
    <Modal
      title={`选择优惠券（单选）`}
      width={780}
      visible={visible}
      afterClose={() => setTabKey('coupon')}
      maskStyle={{ background: 'none' }}
      bodyStyle={{ overflowY: 'auto', maxHeight: 500 }}
      zIndex={1002}
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
      </Tabs>
    </Modal>
  );
};

export default connect(({ baseData, loading }) => ({
  couponList: baseData.buyCoupon,
  loading,
}))(GoodsSelectModal);
