import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Modal, Pagination, Empty, Spin } from 'antd';
import { couponsDom } from './CouponFreeDom';
import './coupon.less';

const FreeCouponSelectModal = (props) => {
  const { couponList, merchantId, ownerType, dispatch, visible, onClose, onOk, loading } = props;
  const { list, total } = couponList;

  const [selectItem, setSelectItem] = useState({}); // 当前选择项
  const [page, setPage] = useState(1); // 页码

  useEffect(() => {
    visible && fetchShareGetFreeCoupon();
  }, [visible, page]);

  // 获取免费券列表
  const fetchShareGetFreeCoupon = () => {
    dispatch({
      type: 'couponManage/fetchGetList',
      payload: {
        merchantId,
        freeOrValuable: 'free',
        ownerType, // merchant: '单店', group: '集团'
        page,
        limit: 10,
      },
    });
  };

  return (
    <Modal
      title={`免费券（单选）`}
      width={780}
      visible={visible}
      afterClose={() => setPage(1)}
      maskStyle={{ background: 'none' }}
      destroyOnClose
      okButtonProps={{ disabled: !selectItem.ownerCouponIdString }}
      onOk={() => onOk(selectItem)}
      onCancel={onClose}
    >
      <Spin spinning={loading}>
        {list.length ? (
          <div className="share_select_list">
            {list.map((item) => couponsDom(item, selectItem.ownerCouponIdString, setSelectItem))}
          </div>
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </Spin>
      <div style={{ textAlign: 'right', marginTop: 10 }}>
        <Pagination
          size="small"
          pageSize={10}
          total={total}
          showTotal={() => `共 ${total} 项`}
          showQuickJumper
          onChange={(val) => setPage(val)}
        />
      </div>
    </Modal>
  );
};

export default connect(({ couponManage, loading }) => ({
  couponList: couponManage,
  loading: loading.effects['couponManage/fetchGetList'],
}))(FreeCouponSelectModal);
