import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Modal, Empty, Spin, Tabs } from 'antd';
import { couponDom } from './CouponFreeDom';
import SearchCondition from '@/components/SearchCondition';
import '../index.less';

const { TabPane } = Tabs;
/**
 * 选择券（多选）
 */
const GoodsSelectModal = (props) => {
  const { list = [], form, dispatch, visible, onClose, loading } = props;

  const [selectItem, setSelectItem] = useState([]); // 当前选择项
  const [tabKey, setTabKey] = useState('coupon'); // tab类型

  useEffect(() => {
    if (visible) {
      if (tabKey === 'coupon') {
        setSelectItem(form.getFieldValue('list') || []);
      }
    }
  }, [visible]);

  // 搜索参数
  const searchItems = [
    {
      label: '券名称',
      name: 'couponName',
      col: false,
    },
  ];

  const listProps = {
    coupon: {
      key: 'platformCouponId',
    },
  }[tabKey];

  // 获取特惠活动
  const fetchCouponSelect = (data) => {
    if (!data.couponName) return;
    dispatch({
      type: 'activeTemplate/fetchPlatformCouponSelectList',
      payload: {
        ...data,
        couponStatus: 1,
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
    } else {
      if (selectItem.length >= 5) return;
      setSelectItem([...selectItem, item]);
    }
  };

  const listDom = (
    <Spin spinning={!!loading.effects['activeTemplate/fetchPlatformCouponSelectList']}>
      {list.length ? (
        <div className="share_select_list">
          {list.map((item) => couponDom(item, selectItem, handleSelect, 'valuable'))}
        </div>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </Spin>
  );

  return (
    <Modal
      title={`选择券（仅显示上架中）（已选 ${selectItem.length}）`}
      width={1125}
      visible={visible}
      afterClose={() => setTabKey('coupon')}
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
      <SearchCondition searchItems={searchItems} handleSearch={fetchCouponSelect}></SearchCondition>
      <Tabs type="card" onChange={setTabKey} style={{ overflow: 'initial' }}>
        <TabPane tab="平台券" key="coupon">
          {listDom}
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default connect(({ activeTemplate, loading }) => ({
  list: activeTemplate.platformCoupon,
  loading,
}))(GoodsSelectModal);
