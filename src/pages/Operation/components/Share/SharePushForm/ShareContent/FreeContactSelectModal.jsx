import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Modal, Pagination, Empty, Spin, Tabs } from 'antd';
import { couponsDom, goodsDom } from './CouponFreeDom';
import './coupon.less';

const { TabPane } = Tabs;

const FreeContactSelectModal = (props) => {
  const { couponList, ownerId, ownerType, dispatch, visible, onClose, onOk, loading } = props;
  const { list, total } = couponList;

  const [selectItem, setSelectItem] = useState({}); // 当前选择项
  const [tabKey, setTabKey] = useState('coupon'); // tab类型
  const [page, setPage] = useState(1); // 页码

  useEffect(() => {
    setPage(1);
  }, [tabKey]);

  useEffect(() => {
    visible && fetchShareGetFreeCoupon();
  }, [visible, page]);

  // 获取免费券列表
  const fetchShareGetFreeCoupon = () => {
    dispatch({
      type: 'shareManage/fetchShareGetFreeCoupon',
      payload: {
        ownerId,
        ownerType, // merchant: '单店', group: '集团'
        page,
        limit: 9,
      },
    });
  };

  const listDom = (
    <Spin spinning={loading}>
      {list.length ? (
        <div className="share_select_list">
          {list.map(
            (item) =>
              ({
                coupon: couponsDom(item, selectItem.ownerCouponId, setSelectItem),
                goods: goodsDom(item, selectItem.ownerCouponId, setSelectItem),
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
      width={1110}
      visible={visible}
      afterClose={() => setPage(1)}
      maskStyle={{ background: 'none' }}
      destroyOnClose
      okButtonProps={{ disabled: !selectItem.ownerCouponId }}
      onOk={() => onOk(selectItem)}
      onCancel={onClose}
    >
      <Tabs type="card" onChange={setTabKey}>
        <TabPane tab="有价券" key="coupon">
          {listDom}
        </TabPane>
        <TabPane tab="特惠商品" key="goods">
          {listDom}
        </TabPane>
      </Tabs>
      <div style={{ textAlign: 'right', marginTop: 10 }}>
        <Pagination
          current={page}
          size="small"
          pageSize={9}
          total={total}
          showTotal={() => `共 ${total} 项`}
          showQuickJumper
          onChange={(val) => setPage(val)}
        />
      </div>
    </Modal>
  );
};

export default connect(({ shareManage, loading }) => ({
  couponList: shareManage.couponList,
  loading: loading.effects['shareManage/fetchShareGetFreeCoupon'],
}))(FreeContactSelectModal);
