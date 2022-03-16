import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Input, Modal, Empty, Spin, Tabs } from 'antd';
import { platformCouponsDom } from './CouponFreeDom';
import SearchCondition from '@/components/SearchCondition';

import './coupon.less';

const { TabPane } = Tabs;
/**
 * 选择平台券（单选）
 */
const FreeContactSelectModal = (props) => {
  const { PlatformCouponList, dispatch, visible, onClose, onOk, loading, typeGoods } = props;

  const [selectItem, setSelectItem] = useState({}); // 当前选择项

  useEffect(() => {
    if (visible) {
      setSelectItem({});
      fetchSpecialGoodsList();
    }
  }, [visible]);

  const listProps = {
    list: PlatformCouponList.list,
    total: PlatformCouponList.total,
    key: 'platformCouponId',
    loading: loading.effects['baseData/fetchPlatformCouponSelect'],
  };

  // 获取平台券
  const fetchSpecialGoodsList = (data) => {
    dispatch({
      type: 'baseData/fetchPlatformCouponSelect',
      payload: {
        ...data,
        couponStatus: 1,
        giveType: 'manual',
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
            platformCouponsDom(item, selectItem.platformCouponId, setSelectItem),
          )}
        </div>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </Spin>
  );

  const searchItems = [
    {
      label: '券名称',
      name: 'couponName',
    },
    {
      label: '券编号',
      name: 'platformCouponId',
    },
  ];

  return (
    <Modal
      title={`选择券`}
      width={1125}
      visible={visible}
      maskStyle={{ background: 'none' }}
      bodyStyle={{ overflowY: 'auto', maxHeight: 500 }}
      destroyOnClose={true}
      okButtonProps={{
        disabled: !selectItem[listProps.key],
      }}
      onOk={() => {
        onOk({ ...selectItem });
        onClose();
      }}
      onCancel={onClose}
    >
      <SearchCondition
        searchItems={searchItems}
        handleSearch={fetchSpecialGoodsList}
      ></SearchCondition>
      <Tabs type="card" style={{ overflow: 'initial' }}>
        <TabPane tab="平台券" key="platformCoupon">
          {listDom}
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default connect(({ baseData, loading }) => ({
  PlatformCouponList: baseData.PlatformCoupon,
  loading,
}))(FreeContactSelectModal);
