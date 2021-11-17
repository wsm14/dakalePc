import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Input, Modal, Empty, Spin, Tabs } from 'antd';
import { goodsDom } from './CouponFreeDom';
import SearchCondition from '@/components/SearchCondition';

import './coupon.less';

const { TabPane } = Tabs;
/**
 * 选择优惠内容（单选）
 */
const FreeContactSelectModal = (props) => {
  const { platformEquityList, dispatch, visible, onClose, onOk, loading, typeGoods } = props;

  const [selectItem, setSelectItem] = useState({}); // 当前选择项

  useEffect(() => {
    if (visible) {
      // 清除上次请求列表数据
      dispatch({ type: 'baseData/clearPlatformEquity' });
      setSelectItem({});
    }
  }, [visible]);

  const listProps = {
    list: platformEquityList.list,
    total: platformEquityList.total,
    key: 'specialGoodsId',
    loading: loading.effects['baseData/fetchGetPlatformEquitySelect'],
  };

  // 获取特惠活动
  const fetchPlatformEquityList = (data) => {
    dispatch({
      type: 'baseData/fetchGetPlatformEquitySelect',
      payload: {
        ...data,
        buyFlag: '0',
        page: 1,
        limit: 999,
      },
    });
  };

  const listDom = (
    <Spin spinning={!!listProps.loading}>
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
      label: '集团/店铺名',
      name: 'relateId',
      type: 'merchant',
      required: true,
    },
    {
      label: '商品名称',
      name: 'goodsName',
    },
  ];

  return (
    <Modal
      title={`选择权益商品（单选）`}
      width={1125}
      visible={visible}
      maskStyle={{ background: 'none' }}
      bodyStyle={{ overflowY: 'auto', maxHeight: 500 }}
      destroyOnClose={true}
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
        <TabPane tab="权益商品" key="goods">
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
